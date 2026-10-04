/* Public compositions used by the research-paper specimen. */
export const research = {
  slug: 'research-paper',
  name: 'Research paper',
  label: 'Continuous reading',
  group: 'Reading',
  previewHeight: 'auto',
  description: 'Typeset an abstract, an argument, equations and references with the report reading scale.',
  api: [
    ['.sheet.sheet-paper', 'A continuous single-column paper using the existing reading scale and shared prose and figure widths.'],
    ['.paper-columns', 'Wrap prose sections in a two-column reading flow. Columns use the existing type size and become one column when the containing width is too narrow.'],
    ['.plate-full between .paper-columns blocks', 'Place a full-width figure or table between column flows. Text resumes below it, including in print. Keep column-width figures and tables inside the flow.'],
    ['.paper-head / .paper-byline / .abstract', 'Title, authors or specimen attribution, and abstract. Use ordinary headings and prose for sections.'],
    ['.equation / .eq-body / .eq-number', 'A native MathML display, its keyboard-scrollable wrapper, and an optional author-supplied number. Use .ref for references.'],
    ['data-dd-color="grayscale" / "monochrome"', 'Neutral inks or black and white, on the root or a document wrapper. The light/dark theme still applies; print uses light. Omit for colour.'],
    ['--dd-font-math', 'Optional mathematical font family. Defaults to the browser’s math font; no font download is required.'],
  ],
  note: 'The research-paper example calculates its graph and table from stated functions. Mark series with dashes and shapes as well as colour. Colour modes cover doc-ui tokens, not raster images or custom colours. Split long equations into MathML table rows to fit print; horizontal scrolling is only available on screen. Authors own equation numbers and their references. Keep titles and abstracts outside .paper-columns, and full-width plates between flows. Write content in reading order without manual left and right blocks. This is a general composition, not a publisher-specific template.',
  story: 'examples-research-paper--two-columns',
  examples: [
    { title: 'Two columns with a full-width figure', html: `<article class="sheet sheet-paper" lang="en" data-dd-color="grayscale" data-dd-paper="a4">
  <header class="paper-head"><h2>Uncertainty in a binary source</h2></header>
  <section class="abstract prose">
    <h3>Abstract</h3>
    <p>Entropy and normalized variance share their endpoints and maximum, but differ between them.</p>
  </section>
  <div class="paper-columns">
    <section class="prose">
      <h3>Definition</h3>
      <p>Binary entropy measures uncertainty in bits. It is zero at either deterministic endpoint and reaches one bit when the two outcomes are equally probable.</p>
      <p>Normalized variance also reaches one at equal probabilities. Its shared numerical range helps compare the shapes, but does not give variance the unit “bit”.</p>
    </section>
  </div>
  <figure class="plate plate-table plate-full">
    <figcaption>Values calculated at equal probabilities.</figcaption>
    <div class="table-wrap"><table>
      <thead><tr><th>Probability p</th><th>Entropy H [bit]</th><th>Variance V [1]</th></tr></thead>
      <tbody><tr><td>0.5</td><td>1</td><td>1</td></tr></tbody>
    </table></div>
  </figure>
  <div class="paper-columns">
    <section class="prose">
      <h3>Interpretation</h3>
      <p>A common maximum does not make the two functions interchangeable. Definitions and units remain essential to interpreting the figure.</p>
      <p>These values describe known theoretical functions. They do not estimate uncertainty from a measured sample or demonstrate compression performance.</p>
    </section>
  </div>
</article>` },
    { title: 'A paper with an abstract', html: `<article class="sheet sheet-paper" lang="en" data-dd-color="grayscale" data-dd-paper="a4" data-dd-print-urls="sources">
  <header class="paper-head">
    <h2>Uncertainty in a binary source</h2>
    <p class="paper-byline">An expository typesetting specimen</p>
  </header>
  <section class="abstract prose">
    <h3>Abstract</h3>
    <p>Entropy and normalized variance share their endpoints and maximum, but differ between them.</p>
  </section>
  <section class="prose">
    <h3>Definition</h3>
    <p>Both curves are calculated directly from their definitions.</p>
  </section>
</article>` },
    { title: 'A numbered equation', html: `<div class="equation" id="binary-variance">
  <div class="eq-body" tabindex="0" role="region" aria-label="Normalized variance">
    <math display="block" translate="no">
      <mi>V</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo>
      <mn>4</mn><mi>p</mi><mo>(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo>)</mo>
    </math>
  </div>
  <a class="eq-number" href="#binary-variance" aria-label="Equation 1">(1)</a>
</div>` },
  ],
};
