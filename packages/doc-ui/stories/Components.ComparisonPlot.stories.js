import { html } from './helpers.js';
import { comparison, comparisonPreview } from './graph-examples.js';

export default {
  title: 'Components/Comparison plot',
  parameters: { docs: { description: { component: 'A dumbbell compares two observations of one measure on a common axis. Label both endpoints and denominators. Hollow and filled marks survive monochrome. The connecting span means difference, not an observed trajectory. Geometry is authored by the generator; type comes from Draw.' } } },
};
export const Coverage = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${comparison}</main></div>` };
export const Report = { render: () => html`<article class="sheet sheet-inset" lang="en">${comparison}</article>` };
export const Narrow = { render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${comparison}</main></div>` };

export const Compact = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${comparisonPreview}<p class="note">Compact index specimen. See the full example for observations, conditions and source.</p></main></div>` };
