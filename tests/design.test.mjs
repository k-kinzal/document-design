/*
 * DESIGN.md states the palette in machine-readable form, for an agent writing a
 * page in some other repository. A spec that has drifted from the stylesheet is
 * worse than none: it is confidently wrong, and the reader has no way to know.
 *
 * So the two are compared here, in CI. Only the colours and the scales are
 * checked — the prose is prose — but those are the part a machine acts on.
 *
 * Deliberately no YAML dependency. The front matter this reads is a flat
 * `key: "value"` block, and a parser is a lot of supply chain for that.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const design = readFileSync(join(root, "DESIGN.md"), "utf8");
const cssDir = join(root, "packages/doc-ui/src/tokens");

/* ---- what DESIGN.md claims ---- */

const frontMatter = design.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontMatter) {
  console.error("DESIGN.md has no YAML front matter.");
  process.exit(1);
}

function block(name) {
  const re = new RegExp(`^${name}:\\n((?:[ \\t]+.*\\n|\\n)*)`, "m");
  const m = frontMatter[1].match(re);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s+([A-Za-z0-9_"'-]+):\s*(.+?)\s*$/);
    if (!kv) continue;
    const key = kv[1].replace(/^["']|["']$/g, "");
    const raw = kv[2];
    /* A quoted value is taken whole — a hex colour contains a # and must not
       be mistaken for the start of a comment, which is what the first version
       of this did to all twenty of them. */
    const quoted = raw.match(/^(["'])([\s\S]*?)\1/);
    const value = quoted ? quoted[2] : raw.replace(/\s+#.*$/, "").trim();
    if (value.startsWith("{")) continue;   /* a token reference, not a literal */
    out[key] = value;
  }
  return out;
}

const claimed = {
  colors: block("colors"),
  rounded: block("rounded"),
  spacing: block("spacing"),
  measure: block("measure"),
};

/* ---- what the stylesheet actually declares ---- */

const css = ["palette.css", "scale.css"]
  .map((f) => readFileSync(join(cssDir, f), "utf8"))
  .join("\n");

const declared = new Map();
for (const m of css.matchAll(/^\s*(--dd-[a-z0-9-]+):\s*([^;]+);/gm)) {
  /* First declaration wins: the dark-theme block redeclares a couple of
     non-colour scalars further down, and the light value is the canonical one. */
  if (!declared.has(m[1])) declared.set(m[1], m[2].replace(/\s+/g, " ").trim());
}

/* ---- the mapping, and the comparison ---- */

const SPACING = { 1: "sp-1", 2: "sp-2", 3: "sp-3", 4: "sp-4", 5: "sp-5",
                  6: "sp-6", 7: "sp-7", 8: "sp-8", baseline: "base" };
const ROUNDED = { sm: "radius-sm", md: "radius", lg: "radius-lg", pill: "radius-pill" };
const MEASURE = { text: "measure", wide: "measure-wide", short: "measure-short" };

const problems = [];

function compare(label, claimedValue, tokenName) {
  const token = `--dd-${tokenName}`;
  const actual = declared.get(token);
  if (actual === undefined) {
    problems.push(`${label}: DESIGN.md names ${token}, which the stylesheet does not declare`);
  } else if (actual !== claimedValue) {
    problems.push(`${label}: DESIGN.md says "${claimedValue}", ${token} is "${actual}"`);
  }
}

for (const [name, value] of Object.entries(claimed.colors)) compare(`colors.${name}`, value, name);
for (const [name, value] of Object.entries(claimed.rounded)) compare(`rounded.${name}`, value, ROUNDED[name]);
for (const [name, value] of Object.entries(claimed.spacing)) compare(`spacing.${name}`, value, SPACING[name]);
for (const [name, value] of Object.entries(claimed.measure)) compare(`measure.${name}`, value, MEASURE[name]);

/* Every palette hue should be stated. A hue added to the stylesheet and not to
   DESIGN.md is a hue an agent will not know it may use. */
const HUES = ["blue", "violet", "amber", "teal", "pink", "indigo", "slate", "green", "yellow", "red"];
for (const hue of HUES) {
  if (!(hue in claimed.colors)) problems.push(`colors.${hue}: in the palette, missing from DESIGN.md`);
}

if (problems.length) {
  console.error(`DESIGN.md disagrees with the stylesheet in ${problems.length} place(s):\n`);
  for (const p of problems) console.error("  " + p);
  console.error("\nUpdate DESIGN.md, or the tokens, so they say the same thing.");
  process.exit(1);
}

const n = Object.keys(claimed.colors).length + Object.keys(claimed.rounded).length +
          Object.keys(claimed.spacing).length + Object.keys(claimed.measure).length;
console.log(`DESIGN.md matches the stylesheet on all ${n} stated values.`);
