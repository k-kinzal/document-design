import { html } from './helpers.js';
import { branching, branchingPreview } from './graph-examples.js';

export default {
  title: 'Components/Flow graph',
  parameters: { docs: { description: { component: 'Explain a decision and its outcomes. All nodes share a module: 224 × 64px with 48px between rows; the compact index uses 96 × 40px with shorter labels at the same text size. Action, decision and outcome use the same title weight and 1.5px outline. Supporting notes sit outside the nodes. Keep arrow tips 8px from their targets and connectors clear of branch labels; no text halos. Use Graph for dependencies and Composition’s ordered flow for an unbranched reading sequence.' } } },
};
export const ReadingMode = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${branching}</main></div>` };
export const Report = { render: () => html`<article class="sheet sheet-inset" lang="en">${branching}</article>` };
export const Narrow = { render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${branching}</main></div>` };

export const Compact = { render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${branchingPreview}<p class="note">Compact index specimen. See the full example for observations, conditions and source.</p></main></div>` };
