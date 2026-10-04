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
      <div class="chips" aria-label="${japanese ? '分類' : 'Kinds'}"><span class="chip chip-sm tone-blue">SELECT</span><span class="chip chip-sm tone-violet">INSERT</span><span class="chip chip-sm tone-teal">UPDATE</span></div>
      <div class="chips" aria-label="${japanese ? '状態' : 'States'}"><span class="chip chip-sm tone-ok">✓ ${japanese ? '解決済み' : 'Resolved'}</span><span class="chip chip-sm tone-warn">! ${japanese ? '一部解決' : 'Partial'}</span><span class="chip chip-sm tone-danger">? ${japanese ? '未解決' : 'Unresolved'}</span></div>
    </div>`).join('')}</div>
  </article>`).join('')}</div></div>`;
}

export const Pairs = { render: () => pairs() };
export const JapanesePairs = {
  parameters: { docs: { description: { story: 'The same WordPress finding count with explicitly marked Japanese labels.' } } },
  render: () => pairs(true),
};

export const InkRoles = {
  parameters: { docs: { description: { story: 'Review each complete ink set together: accent, all seven identity hues, all three states, and a warning surface. Paper / Blue is the original palette. The other sets coordinate lightness and chroma without changing what a hue means.' } } },
  render: () => html`<div class="doc doc-inset"><div class="cards">${palettes.filter(p => p.family === 'paper').map(p => `<article class="card">
    <h3>${p.name}</h3><div class="palette-pair">${['light', 'dark'].map(mode => `<div class="palette-sample" data-dd-palette="${p.id}" data-dd-theme="${mode}">
      <span class="cap">${mode}</span>
      <div class="stat tone-accent"><b class="stat-fig">978</b><span class="stat-label">WordPress findings</span></div>
      <div class="chips" aria-label="Identity inks">${['blue', 'violet', 'amber', 'teal', 'pink', 'indigo', 'slate'].map(hue => `<span class="chip chip-sm tone-${hue}">${hue}</span>`).join('')}</div>
      <div class="chips" aria-label="States"><span class="chip chip-sm tone-ok">✓ Resolved</span><span class="chip chip-sm tone-warn">! Partial</span><span class="chip chip-sm tone-danger">? Unresolved</span></div>
      <div><p class="caveat">Only 35 of 844 statements are fully resolved.</p></div>
      <a href="#">View findings →</a>
    </div>`).join('')}</div>
  </article>`).join('')}</div></div>`,
};
