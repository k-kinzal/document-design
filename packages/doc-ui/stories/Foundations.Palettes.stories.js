import { html } from './helpers.js';
import { palettes } from '../src/palettes.mjs';

export default {
  title: 'Foundations/Palettes',
  parameters: { docs: { description: { component: '32 paper and accent combinations. Each includes light and dark. Load one palettes/<id>.css after the base CSS, or load document-design.palettes.css and set data-dd-palette. Identity and state colors keep their meaning; red remains reserved for missing or unresolved information. The toolbar applies a palette to any story.' } } },
};

function pairs(japanese = false) {
  return html`<div class="doc doc-inset" lang="${japanese ? 'ja' : 'en'}"><div class="cards">${palettes.map(p => `<article class="card">
    <h3>${p.name}</h3><div class="palette-pair">${['light', 'dark'].map(mode => `<div class="palette-sample" data-dd-palette="${p.id}" data-dd-theme="${mode}">
      <span class="cap">${japanese ? (mode === 'light' ? 'ライト' : 'ダーク') : mode}</span>
      <div class="stat tone-accent"><b class="stat-fig">978</b><span class="stat-label">${japanese ? '検出事項' : 'findings'}</span></div>
      <span class="chip chip-sm tone-danger">? ${japanese ? '未解決' : 'Unresolved'}</span>
    </div>`).join('')}</div>
  </article>`).join('')}</div></div>`;
}

export const Pairs = { render: () => pairs() };
export const JapanesePairs = {
  parameters: { docs: { description: { story: 'The same WordPress finding count with explicitly marked Japanese labels.' } } },
  render: () => pairs(true),
};
