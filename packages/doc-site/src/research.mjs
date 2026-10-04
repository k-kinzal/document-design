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
    ['.paper-head / .paper-byline / .abstract', 'Title, authors or specimen attribution, and abstract. Use ordinary headings and prose for sections.'],
    ['.equation / .eq-body / .eq-number', 'A native MathML display, its keyboard-scrollable wrapper, and an optional author-supplied number. Use .ref for references.'],
    ['data-dd-color="grayscale" / "monochrome"', 'Neutral inks or black and white, on the root or a document wrapper. The light/dark theme still applies; print uses light. Omit for colour.'],
    ['--dd-font-math', 'Optional mathematical font family. Defaults to the browser’s math font; no font download is required.'],
  ],
  note: 'The research-paper example calculates its graph and table from stated functions. Mark series with dashes and shapes as well as colour. Colour modes cover doc-ui tokens, not raster images or custom colours. Split long equations into MathML table rows to fit print; horizontal scrolling is only available on screen. Authors own equation numbers and their references.',
  story: 'examples-research-paper--grayscale',
  examples: [
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
