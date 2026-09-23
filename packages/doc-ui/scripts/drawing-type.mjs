/*
 * The type inside a drawing belongs to the system, not to the markup.
 *
 * Every label in every figure used to carry its own font-size, font-weight,
 * letter-spacing and fill, decided where it was drawn. Four sizes were in use
 * — 14, 15, 16, 20 — and none of them was a step on either scale. Worse, an
 * SVG scales to its box and its text with it, so an authored 15 rendered at
 * 13.8 on a full sheet and 9.4 at 820px: the floor the rest of the system
 * holds at 14 did not apply inside a picture, because nothing carried it
 * there.
 *
 * components/draw.css carries it there. This keeps it carried:
 *
 *   1. a drawing states the width it was drawn at, so its scale is 1 and an
 *      authored size is the rendered size
 *   2. its labels take roles, not measurements
 *
 * Run over the stories, which are the system's own examples and therefore the
 * first place the rule gets broken.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirs = ["stories"];

/* Presentational type on a <text> — the thing draw.css exists to replace. */
const BANNED = ["font-size", "font-weight", "letter-spacing", "font-family", "fill"];

const problems = [];
let drawings = 0;
let labels = 0;

for (const dir of dirs) {
  for (const name of readdirSync(join(root, dir))) {
    if (!name.endsWith(".js") && !name.endsWith(".mjs")) continue;
    const file = join(dir, name);
    const text = readFileSync(join(root, file), "utf8");
    const lineOf = (i) => text.slice(0, i).split("\n").length;

    /* Every <svg class="…draw…"> and what is inside it, up to its </svg>. */
    const open = /<svg\b[^>]*\bclass="[^"]*\bdraw\b[^"]*"[^>]*>/g;
    for (let m; (m = open.exec(text)); ) {
      drawings++;
      const tag = m[0];
      const line = lineOf(m.index);

      if (!/--dd-draw-width\s*:/.test(tag)) {
        problems.push(
          `${file}:${line}  a drawing does not say how wide it was drawn.\n` +
            `    Add style="--dd-draw-width: <viewBox width>px". Without it the\n` +
            `    drawing stretches or shrinks to its column and takes its labels with it.`,
        );
      }

      const close = text.indexOf("</svg>", open.lastIndex);
      const body = text.slice(open.lastIndex, close < 0 ? text.length : close);

      const texts = /<text\b([^>]*)>/g;
      for (let t; (t = texts.exec(body)); ) {
        labels++;
        const attrs = t[1];
        const found = BANNED.filter((a) => new RegExp(`\\b${a}\\s*=`).test(attrs));
        if (found.length) {
          problems.push(
            `${file}:${lineOf(open.lastIndex + t.index)}  a label sets its own type: ${found.join(", ")}.\n` +
              `    Use a role from components/draw.css — draw-label, draw-strong, draw-note,\n` +
              `    draw-value, draw-cap, draw-mono, draw-accent, draw-warn.`,
          );
        }
      }
    }
  }
}

if (problems.length) {
  console.error(`drawing type: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(p + "\n");
  process.exit(1);
}

console.log(
  `drawing type: ${drawings} drawing(s), ${labels} label(s) — all sized by the system`,
);
