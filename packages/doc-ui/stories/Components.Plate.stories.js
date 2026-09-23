import { html, specimen } from "./helpers.js";

export default {
  title: "Components/Plate",
  parameters: {
    docs: {
      description: {
        component:
          "A figure as a unit of explanation rather than a box with a picture in it.\n\n" +
          "The drawing is one of several parts. A reader who cannot find the " +
          "conditions the figure was measured under, or cannot tell which mark the " +
          "paragraph means by “this one”, has been given a picture and not an " +
          "explanation. So a plate carries the drawing, its labels, a caption, a " +
          "number, where the data came from, and a name the running text can point at.\n\n" +
          "**Three widths.** Text is capped at the measure because a long line is " +
          "hard to return from. A drawing is looked at rather than swept, and a " +
          "table's columns get narrower for nothing, so a plate may leave it: " +
          "`--dd-measure` → `.plate-wide` → `.plate-full`.\n\n" +
          "**The number is CSS, the reference is yours.** A counter can be read " +
          "where it is declared and nowhere else, so the sentence saying “see " +
          "Figure 2” cannot ask the caption what it ended up being. When a " +
          "generator writes one number it must write both — `.plate-unnumbered` " +
          "turns the counter off so the two cannot drift apart.",
      },
    },
  },
};

const scale = (w = 520, lang = "en") => `
  <svg class="draw" style="--dd-draw-width:${w}px" viewBox="0 0 ${w} 120" role="img"
       aria-label="${lang === "ja" ? "0から100の尺。68.97が変更前、96.67が上限。" : "A scale from 0 to 100. Before: 68.97. Ceiling: 96.67."}">
    <text x="16" y="18" text-anchor="start" class="draw-cap">BEFORE / AFTER</text>
    <line class="draw-line" x1="16" y1="62" x2="${w - 16}" y2="62"/>
    <circle class="plot-before" cx="${Math.round((w - 32) * 0.69) + 16}" cy="62" r="5"/>
    <circle class="plot-point" cx="${Math.round((w - 32) * 0.967) + 16}" cy="62" r="6"/>
    <text x="${Math.round((w - 32) * 0.69) + 16}" y="44" text-anchor="middle" class="draw-value draw-note">68.97</text>
    <text x="${Math.round((w - 32) * 0.967) + 16}" y="44" text-anchor="end" class="draw-value draw-accent">96.67</text>
    <text x="16" y="92" text-anchor="start" class="draw-note">0</text>
    <text x="${w - 16}" y="92" text-anchor="end" class="draw-warn">${lang === "ja" ? "100 にはしない" : "Do not force 100"}</text>
  </svg>`;

/** The parts, and a sentence that points at them. */
export const Anatomy = {
  render: () => html`
<div class="prose" lang="en">
  <p>Nine of 29 source units were empty. <a class="ref" href="#plate-anatomy">Figure 1</a> shows the result:
  96.67 is the honest ceiling. Do not reach 100 by relabelling gaps as unsupported.</p>

  <figure class="plate plate-wide" id="plate-anatomy">
    <div class="draw-wrap">${scale(520)}</div>
    <figcaption>Coverage scale. The result is 96.67; 100 is not attainable under these conditions.<span class="plate-source">bison-parser 3.8.2 · As of 2026-02-11 · Gates 96 / 93 / 100</span></figcaption>
  </figure>

  <p>CSS assigns the caption number; the author writes “Figure 1” in the prose. Counters cannot supply that reference,
  so a generator that owns the numbering should use <code>.plate-unnumbered</code> and write both numbers.</p>
</div>`,
};

/** The measure, the figure width, and the column. */
export const Widths = {
  render: () => html`
<div class="prose">
  <p>Running text stops at <code>--dd-measure</code>: 36 characters of Japanese, 77 of latin.
  A plate may stay there, or leave.</p>

  <figure class="plate">
    <div class="draw-wrap">${scale(360)}</div>
    <figcaption>Default — the plate sits at the measure, with the text.</figcaption>
  </figure>

  <figure class="plate plate-wide">
    <div class="draw-wrap">${scale(520)}</div>
    <figcaption><code>.plate-wide</code> — <code>--dd-measure-wide</code>, 48 characters. A drawing or a wide table.</figcaption>
  </figure>

  <figure class="plate plate-full">
    <div class="draw-wrap">${scale(700)}</div>
    <figcaption><code>.plate-full</code> — the whole column. The caption stays at the measure, because the caption is read.</figcaption>
  </figure>
</div>`,
};

/** A table's caption goes above it. */
export const Table = {
  render: () => html`
<div class="prose">
  <figure class="plate plate-table plate-wide">
    <figcaption>What each severity means, and how many carry it.</figcaption>
    <div class="table-wrap"><table>
      <thead><tr><th scope="col">Rule</th><th scope="col">Severity</th><th class="num" scope="col">Statements</th></tr></thead>
      <tbody>
        <tr><td class="mono">dynamic-sql</td><td><span class="chip tone-amber">medium</span></td><td class="num">709</td></tr>
        <tr><td class="mono">analysis-incomplete</td><td><span class="chip tone-slate">low</span></td><td class="num">239</td></tr>
        <tr><td class="mono">unresolved-sql</td><td><span class="chip tone-slate">low</span></td><td class="num">25</td></tr>
      </tbody>
    </table></div>
  </figure>
  <p>A figure's caption goes under it and a table's goes over it: a table is read downward from
  its heading, and a caption arriving after forty rows arrives too late to say what was being read.
  The two number on separate sequences, because a reader looking for Table 2 does not want to count figures.</p>
</div>`,
};

/** Every role a label can take, at the size the system gives it. */
export const Labels = {
  render: () => html`
<div>
  ${specimen(
    "The roles — all one size (--dd-text-md, 14px), distinguished by weight, colour and family",
    `<div class="draw-wrap"><svg class="draw" style="--dd-draw-width:660px" viewBox="0 0 660 260" role="img"
       aria-label="Examples of the text roles in draw.css.">
      <text x="20" y="24" text-anchor="start" class="draw-cap">DRAW ROLES</text>
      ${[
        [".draw-label", "a name on a box", "draw-label"],
        [".draw-strong", "the one it is about", "draw-strong"],
        [".draw-note", "a second line", "draw-note"],
        [".draw-value", "29 / 30", "draw-value"],
        [".draw-mono", "BISON-RUNTIME-001", "draw-mono draw-note"],
        [".draw-accent", "After", "draw-accent"],
        [".draw-warn", "Left empty", "draw-warn"],
      ]
        .map(
          ([name, sample, cls], i) =>
            `<text x="20" y="${62 + i * 28}" text-anchor="start" class="draw-mono draw-note">${name}</text>
             <text x="300" y="${62 + i * 28}" text-anchor="start" class="${cls}">${sample}</text>`,
        )
        .join("")}
    </svg></div>`,
  )}
  ${specimen(
    "The marks",
    `<div class="draw-wrap"><svg class="draw" style="--dd-draw-width:660px" viewBox="0 0 660 96" role="img"
       aria-label="Examples of the drawing marks in draw.css.">
      <rect class="draw-box" x="16" y="28" width="120" height="40" rx="8"/>
      <text x="76" y="54" text-anchor="middle" class="draw-label">.draw-box</text>
      <rect class="draw-box-toned" style="--dd-tone:var(--dd-accent);--dd-tone-tint:var(--dd-accent-tint)" x="164" y="28" width="150" height="40" rx="8"/>
      <text x="239" y="54" text-anchor="middle" class="draw-label">.draw-box-toned</text>
      <rect class="draw-box-open" x="342" y="28" width="150" height="40" rx="8"/>
      <text x="417" y="54" text-anchor="middle" class="draw-warn">.draw-box-open</text>
      <path class="draw-line" d="M520 48H620"/>
      <path class="draw-line" d="M612 42L620 48L612 54"/>
    </svg></div>`,
  )}
</div>`,
};

/** Two drawings, one figure: a comparison that never has to be scrolled. */
export const Panels = {
  render: () => html`
<div class="prose" lang="en">
  <p>Before and after form one explanation, with one number and one caption. Keep the two drawings separate:
  putting both in a single fixed-width drawing makes readers in narrow containers remember one side while scrolling to the other.</p>

  <figure class="plate plate-full" id="plate-compare">
    <div class="compare compare-draw">
      <div class="was"><span class="cap">Before · 9 empty</span>
        <div class="draw-wrap"><svg class="draw" style="--dd-draw-width:268px" viewBox="0 0 268 168" role="img" aria-label="All nine units are empty.">
          <rect class="draw-group" x="16" y="16" width="236" height="136" rx="12"/>
          ${[0,1,2,3,4].map(i=>`<rect class="draw-box-open tone-neutral" x="${36+i*36}" y="36" width="28" height="28" rx="6"/>`).join('')}
          ${[0,1,2,3].map(i=>`<rect class="draw-box-open tone-neutral" x="${54+i*36}" y="72" width="28" height="28" rx="6"/>`).join('')}
          <text x="134" y="132" text-anchor="middle" class="draw-mono draw-note">20 / 29</text>
        </svg></div>
      </div>
      <div class="now"><span class="cap">After · 7 linked / 1 tested / 1 left</span>
        <div class="draw-wrap"><svg class="draw" style="--dd-draw-width:340px" viewBox="0 0 340 168" role="img" aria-label="Seven linked, one new scenario, and one left empty.">
          <rect class="draw-group tone-accent" x="16" y="16" width="308" height="136" rx="12"/>
          ${[0,1,2,3,4,5,6].map(i=>`<rect class="draw-box-toned tone-accent" x="${36+i*32}" y="36" width="24" height="24" rx="6"/>`).join('')}
          <rect class="draw-box-alt tone-accent" x="268" y="36" width="24" height="24" rx="6"/>
          <rect class="draw-box-open" x="300" y="36" width="24" height="24" rx="6"/>
          <text x="140" y="84" text-anchor="middle" class="draw-accent">7 existing scenarios</text>
          <text x="140" y="108" text-anchor="middle" class="draw-mono draw-accent">005–008 · RULE-007</text>
          <text x="290" y="84" text-anchor="middle" class="draw-warn">1 empty</text>
          <text x="170" y="140" text-anchor="middle" class="draw-mono draw-accent">29 / 30</text>
        </svg></div>
      </div>
    </div>
    <figcaption>Where the nine source units went.<span class="plate-source">bison-parser 3.8.2 · As of 2026-02-11</span></figcaption>
  </figure>

  <p>Panels use their drawing widths and wrap as soon as they no longer fit side by side.
  They stay adjacent, sharing one number and one caption.</p>
</div>`,
};

/** Japanese figure prefix, reference, and caption at the same drawing scale. */
export const JapaneseCaption = {
  render: () => html`
<div class="prose" lang="ja">
  <p>出典 29 単位のうち 9 が空だった。到達点は <a class="ref" href="#plate-anatomy-ja">図 1</a> のとおりで、
  96.67 が正直な上限であり、100 は非対応への付け替えで作らない。</p>

  <figure class="plate plate-wide" id="plate-anatomy-ja">
    <div class="draw-wrap">${scale(520, "ja")}</div>
    <figcaption>カバレッジの尺。96.67 は到達した値であり、100 は取れる値ではない。<span class="plate-source">bison-parser 3.8.2 · 2026-02-11 時点 · ゲート 96 / 93 / 100</span></figcaption>
  </figure>

  <p>番号はカウンタが振る。本文の「図 1」は著者が書く — CSS のカウンタは宣言した場所でしか読めないので、
  生成側が番号を持つなら <code>.plate-unnumbered</code> で両方を生成側が持つ。</p>
</div>`,
};
