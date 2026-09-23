import { html } from './helpers.js';
import { histogram, histogramPreview } from './graph-examples.js';

export default {
  title: 'Components/Histogram',
  parameters: { docs: { description: { component: 'Show a distribution, not a ranking. Put numeric bins in order, keep equal bin widths on a count axis, include observed empty bins, and state the sample size and boundary convention. If widths differ, use frequency density rather than count. An absent dataset belongs in Empty; it is not a histogram full of zeros.' } } },
};
export const Callers = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${histogram}</main></div>` };
export const Report = { render: () => html`<article class="sheet sheet-inset" lang="en">${histogram}</article>` };
export const Narrow = { render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${histogram}</main></div>` };

export const Compact = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${histogramPreview}<p class="note">Compact index specimen. See the full example for observations, conditions and source.</p></main></div>` };
