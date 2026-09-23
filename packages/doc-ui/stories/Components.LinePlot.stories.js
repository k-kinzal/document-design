import { html } from './helpers.js';
import { trend, missingTrend, trendPreview } from './graph-examples.js';

export default {
  title: 'Components/Line plot',
  parameters: { docs: { description: { component: 'Follow a measure along an ordered numeric axis: time, position or distance. Use straight segments only when interpolation is meaningful, steps for discrete accumulation, and separate paths across missing observations. Label axes, domain and units. Do not connect unordered categories or invent intermediate samples.' } } },
};
export const Cumulative = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${trend}</main></div>` };
export const MissingInterval = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${missingTrend}</main></div>` };
export const Report = { render: () => html`<article class="sheet sheet-inset" lang="en">${trend}</article>` };
export const Narrow = { render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${trend}</main></div>` };

export const Compact = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${trendPreview}<p class="note">Compact index specimen. See the full example for observations, conditions and source.</p></main></div>` };
