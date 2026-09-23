import { html } from './helpers.js';
import { bars, missingBars } from './graph-examples.js';

export default {
  title: 'Components/Bar chart',
  parameters: { docs: { description: { component: 'Compare category magnitudes on a shared zero baseline. Keep units and exact values in HTML. Set --dd-bar to value / shared maximum × 100%; never normalize each row independently. Use Meter when the question is how a single whole divides.' } } },
};
export const Callers = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${bars}</main></div>` };
export const ZeroAndUnknown = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${missingBars}</main></div>` };
export const Report = { render: () => html`<article class="sheet sheet-inset" lang="en">${bars}</article>` };
export const Narrow = { render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${bars}</main></div>` };
