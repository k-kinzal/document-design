import { html } from './helpers.js';

export default {
  title: 'Components/Equation',
  parameters: { docs: { description: { component: 'Native MathML for inline and display mathematics. .equation pairs a scrollable .eq-body with an optional .eq-number; the author owns the number and matching .ref text. Give the scroll area tabindex="0" and an accessible name. Split long derivations into display-style MathML table rows before printing: formulas keep their reading size and are not automatically line-broken. Set --dd-font-math to an installed mathematical font if required; the default uses the browser’s math font.' } } },
};

export const Numbered = {
  render: () => html`<article class="sheet sheet-paper" lang="en">
    <div class="prose"><h2>Entropy of a finite source</h2><p>For outcome probabilities <math><msub><mi>p</mi><mi>i</mi></msub></math>, use <a class="ref" href="#entropy-equation">equation (1)</a>.</p></div>
    <div class="equation" id="entropy-equation">
      <div class="eq-body" tabindex="0" role="region" aria-label="Entropy equation">
        <math display="block"><mi>H</mi><mo stretchy="false">(</mo><mi>X</mi><mo stretchy="false">)</mo><mo>=</mo><mo>−</mo><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>p</mi><mi>i</mi></msub><msub><mi>log</mi><mn>2</mn></msub><msub><mi>p</mi><mi>i</mi></msub></math>
      </div><a class="eq-number" href="#entropy-equation" aria-label="Equation 1">(1)</a>
    </div>
  </article>`,
};

export const Unnumbered = {
  render: () => html`<div class="equation"><div class="eq-body" tabindex="0" role="region" aria-label="Binary variance"><math display="block"><mi>V</mi><mo stretchy="false">(</mo><mi>p</mi><mo stretchy="false">)</mo><mo>=</mo><mn>4</mn><mi>p</mi><mo stretchy="false">(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo stretchy="false">)</mo></math></div></div>`,
};
