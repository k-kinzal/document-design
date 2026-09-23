/*
 * A drawing belongs to the system, not to the markup.
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
 *   3. its MARKS take roles, not measurements
 *
 * (3) is the later half, and it was added after measuring what (1) and (2)
 * had left behind. Of 146 shapes in the system's own figures, 0 `<text>`
 * elements set their own type — the rule had held perfectly for two rounds —
 * and 78 shapes set their own paint, in 11 distinct literal values, one of
 * them a raw palette token (`--dd-red`) used as a stroke where the role
 * tokens exist precisely so that red means one thing. The argument for the
 * words was never an argument about words: a drawing's marks are read by the
 * same reader in the same minute, and a figure whose boxes are painted by
 * hand is a figure that stops matching the page around it the first time the
 * page changes.
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
const BANNED_TYPE = ["font-size", "font-weight", "letter-spacing", "font-family", "fill"];

/*
 * Presentational paint on a mark. `fill="none"` is exempt: it is not a colour
 * decision, it is the difference between an outline and a solid, and a role
 * that wants an outline already says so. Everything else names a value the
 * role tokens are there to hold.
 */
const BANNED_PAINT = ["fill", "stroke", "stroke-width", "stroke-dasharray", "fill-opacity", "stroke-opacity", "opacity"];
const SHAPES = ["rect", "circle", "ellipse", "line", "path", "polygon", "polyline"];

const ROLES_TYPE = "draw-label, draw-strong, draw-note, draw-value, draw-cap, draw-mono, draw-accent, draw-warn, draw-toned";
const ROLES_MARK =
  "draw-box, draw-box-toned, draw-box-open, draw-group, draw-group-open, draw-fill, draw-line,\n" +
  "    draw-line-open, draw-guide, draw-arrow, draw-focus, leader, leader-foot, mark, plot-*, node*, edge*";

const problems = [];
let drawings = 0;
let labels = 0;
let marks = 0;

/*
 * A drawing is anything the drawing rules reach: `.draw`, and `.graph`, which
 * takes its type from the same file.
 *
 * Matched as a class TOKEN, not as a substring. `\bdraw\b` looks like it says
 * that and does not: `-` is a non-word character, so it matches the `draw` in
 * `draw-defs` — and the marker block, which is 0 × 0 by design and has no
 * viewBox to state a width from, was reported as a drawing that would not say
 * how wide it was drawn. Every future `draw-…` class on an `<svg>` would have
 * done the same.
 */
const OPEN = /<svg\b[^>]*\sclass="([^"]*)"[^>]*>/g;
const isDrawing = (classList) =>
  classList.split(/\s+/).some((c) => c === "draw" || c === "graph");

for (const dir of dirs) {
  for (const name of readdirSync(join(root, dir))) {
    if (!name.endsWith(".js") && !name.endsWith(".mjs")) continue;
    const file = join(dir, name);
    const text = readFileSync(join(root, file), "utf8");
    const lineOf = (i) => text.slice(0, i).split("\n").length;

    const open = new RegExp(OPEN.source, "g");
    for (let m; (m = open.exec(text)); ) {
      if (!isDrawing(m[1])) continue;
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
        const found = BANNED_TYPE.filter((a) => new RegExp(`\\b${a}\\s*=`).test(attrs));
        if (found.length) {
          problems.push(
            `${file}:${lineOf(open.lastIndex + t.index)}  a label sets its own type: ${found.join(", ")}.\n` +
              `    Use a role from components/draw.css — ${ROLES_TYPE}.`,
          );
        }
      }

      const shapes = new RegExp(`<(${SHAPES.join("|")})\\b([^>]*)>`, "g");
      for (let sh; (sh = shapes.exec(body)); ) {
        marks++;
        const attrs = sh[2];
        const found = BANNED_PAINT.filter((a) => {
          const hit = attrs.match(new RegExp(`\\b${a}\\s*=\\s*"([^"]*)"`));
          if (!hit) return false;
          /* fill="none" is a shape decision, not a colour one. */
          return !(a === "fill" && hit[1].trim() === "none");
        });
        if (found.length) {
          problems.push(
            `${file}:${lineOf(open.lastIndex + sh.index)}  a <${sh[1]}> paints itself: ${found.join(", ")}.\n` +
              `    Use a mark role from components/draw.css, components/plot.css or\n` +
              `    components/annotate.css —\n    ${ROLES_MARK}\n` +
              `    A hand-painted mark stops matching the page the first time the page changes,\n` +
              `    and does not follow the tone, the theme or a forced palette.`,
          );
        }
      }
    }
  }
}

/*
 * An arrowhead needs the marker it points at. `marker-end` is set in CSS by
 * `.draw-arrow`, so an author who uses the class and forgets the block gets
 * a line with nothing on the end of it — and no error anywhere, because a
 * missing marker reference is not an error in SVG.
 */
for (const dir of dirs) {
  for (const name of readdirSync(join(root, dir))) {
    if (!name.endsWith(".js") && !name.endsWith(".mjs")) continue;
    const file = join(dir, name);
    const text = readFileSync(join(root, file), "utf8");
    /* `drawDefs` is stories/helpers.js's copy of the same block. */
    if (/\bdraw-arrow\b/.test(text) && !/\bdraw-defs\b|\bdrawDefs\b/.test(text)) {
      problems.push(
        `${file}  uses .draw-arrow but the document has no <svg class="draw-defs">.\n` +
          `    The arrowhead is a marker defined once per document. Without it the\n` +
          `    line simply ends, and SVG reports nothing.`,
      );
    }
  }
}

if (problems.length) {
  console.error(`drawing: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(p + "\n");
  process.exit(1);
}

console.log(
  `drawing: ${drawings} drawing(s), ${labels} label(s), ${marks} mark(s) — all set by the system`,
);
