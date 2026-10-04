import palettes from '@k-kinzal/doc-ui/palettes' with { type: 'json' };

export function paletteSelect() {
  return `<label class="palette-select" data-dd-enhance hidden>Palette <select class="input palette-select" data-dd-palette-select>${palettes.map(p => `<option value="${p.id}" translate="no">${p.name}</option>`).join('')}</select></label>`;
}

export function paletteGallery(base) {
  return `<div class="cards">${palettes.map(p => `<article class="card" aria-labelledby="palette-${p.id}">
    <h3 id="palette-${p.id}" translate="no">${p.name}</h3>
    <div class="palette-pair">${['light', 'dark'].map(mode => `<div class="palette-sample" data-dd-palette="${p.id}" data-dd-theme="${mode}">
      <span class="cap">${mode === 'light' ? 'Light' : 'Dark'}</span>
      <div class="stat tone-accent"><b class="stat-fig">978</b><span class="stat-label">findings</span></div>
      <span class="chip chip-sm tone-danger">? Unresolved</span>
    </div>`).join('')}</div>
    <div class="card-more actions"><button class="btn" data-dd-palette-choice="${p.id}" aria-describedby="palette-${p.id}" aria-pressed="false" data-dd-enhance hidden><span data-dd-palette-label>Use this palette</span></button><a href="${base}${p.id}.css" download="${p.id}.css">Download CSS ↓</a></div>
  </article>`).join('')}</div>`;
}
