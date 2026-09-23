/*
 * Build — bundle the source into the files that get published.
 *
 * Lightning CSS resolves the @import graph into one file, so a consumer makes
 * one request and an offline copy is one file to keep. It also downlevels
 * against the target floor below.
 */
import { bundle, transform, browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = here;
const dist = join(root, "dist");

/*
 * The support floor.
 *
 * Deliberately older than the features the source is written in: these
 * documents get archived, mailed around and opened in whatever the reader
 * has. Lightning CSS turns nesting into plain selectors here, so the shipped
 * file needs nothing newer than the floor to parse.
 *
 * light-dark() and color-mix() stay as written — both are Baseline, and
 * neither has a failure mode that costs more than the colour it names.
 */
const QUERY = "> 0.3%, last 3 years, not dead";
const targets = browserslistToTargets(browserslist(QUERY));

function build(entry, name) {
  const { code } = bundle({
    filename: join(root, entry),
    minify: false,
    targets,
    /* Keep the layer declarations and the comments that explain the system:
       the readable build is documentation as much as it is a stylesheet. */
    include: 0,
  });
  const pretty = code.toString();
  writeFileSync(join(dist, `${name}.css`), pretty);

  const { code: min } = transform({
    filename: `${name}.css`,
    code: Buffer.from(pretty),
    minify: true,
    targets,
  });
  writeFileSync(join(dist, `${name}.min.css`), min.toString());

  return { pretty: pretty.length, min: min.length };
}

mkdirSync(dist, { recursive: true });

const results = [
  ["src/index.css", "document-design"],
  ["src/tokens.css", "document-design.tokens"],
].map(([entry, name]) => [name, build(entry, name)]);

/* The behaviour layer ships as written — it is small, and a reader who opens
   a generated document and wonders what the page is doing should be able to
   read the answer. */
const js = readFileSync(join(root, "src/js/document-design.js"), "utf8");
writeFileSync(join(dist, "document-design.js"), js);

for (const [name, size] of results) {
  console.log(
    `${name}.css`.padEnd(32),
    `${(size.pretty / 1024).toFixed(1)} kB`.padStart(9),
    `→ min ${(size.min / 1024).toFixed(1)} kB`
  );
}
console.log("document-design.js".padEnd(32), `${(js.length / 1024).toFixed(1)} kB`.padStart(9));
