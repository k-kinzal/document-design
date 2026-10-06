# Papers and articles

Use `.sheet.sheet-paper` for continuous reading, with `.paper-head`,
`.abstract.prose`, and sections of `.prose`. Keep the manuscript's actual
structure; an abstract, keywords, or numbered sections are not mandatory.

```html
<article class="sheet sheet-paper" lang="en"
         data-dd-paper="a4" data-dd-print-urls="sources">
  <header class="paper-head">
    <h1>Uncertainty in a binary source</h1>
    <p class="paper-byline">An expository note</p>
  </header>
  <section class="abstract prose" aria-labelledby="abstract-title">
    <h2 id="abstract-title">Abstract</h2>
    <p>This note examines how entropy describes a binary source.</p>
  </section>
  <section class="prose">
    <h2>Definition</h2>
    <p>Entropy depends on outcome probabilities.
      <a class="cite" href="#src-shannon">1</a></p>
  </section>
  <section class="prose">
    <h2>References</h2>
    <ol class="sources">
      <li id="src-shannon">
        <a href="https://web.mit.edu/6.976/www/handout/shannon.pdf"
           lang="en">C. E. Shannon. A Mathematical Theory of Communication.</a>
        <span class="source-meta">The Bell System Technical Journal (1948).</span>
      </li>
    </ol>
  </section>
</article>
```

- Cite sources with `.cite` and a matching `.sources > li` ID. The anchor text
  is the source number without brackets; CSS adds them. Sources keep their
  original titles and language, including `lang="ja"` for Japanese titles in
  an English paper. Keep source entries as list items so numbering works.
- Use `.ref` for references to figures, tables, or equations. The generator
  owns reference text and must keep it synchronized with displayed numbers.
- Use native MathML for mathematics. Display equations use the structure below;
  the author owns `.eq-number`. Omit that anchor for an unnumbered equation.

```html
<div class="equation" id="eq-variance">
  <div class="eq-body" tabindex="0" role="region" aria-label="Binary variance">
    <math display="block">
      <mi>V</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo>
      <mn>4</mn><mi>p</mi><mo>(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo>)</mo>
    </math>
  </div>
  <a class="eq-number" href="#eq-variance" aria-label="Equation 1">(1)</a>
</div>
```

Use `.paper-columns` only when two-column reading is wanted. Keep the title and
abstract outside it. Put a full-width `.plate-full` between two column flows;
do not use `column-span` to interrupt a flow. Split long formulas into MathML
`mtable` rows before printing instead of shrinking their type.

`data-dd-paper="a4"` or `"letter"` selects page size and page numbers.
`data-dd-print-urls="sources"` prints URLs in the source list; `"none"` omits
them. Print with CSS page size and browser headers/footers disabled, then
verify reading order, equations, captions, and page ends in the PDF.

Source examples: `packages/doc-ui/stories/research-paper.mjs` and
`packages/doc-ui/stories/Components.Equation.stories.js`.
