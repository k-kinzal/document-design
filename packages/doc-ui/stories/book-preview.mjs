import { bookVariables } from '../src/book.mjs';

const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function anatomy(leaf, g, src) {
  const px = mm => mm * 96 / 25.4;
  const w = px(g.width), h = px(g.height), left = px(leaf.number % 2 ? g.gutter : g.fore);
  const side = leaf.number % 2 ? ['Gutter', 'Fore-edge'] : ['Fore-edge', 'Gutter'];
  return `<svg class="draw" style="--dd-draw-width: ${w}px" viewBox="0 0 ${w} ${h}" role="img" aria-label="Page ${leaf.number}: trim, type area, head, foot, gutter and fore-edge">
    <image href="${src}" width="${w}" height="${h}"/>
    <rect class="draw-box-alt tone-blue" x="${left}" y="${px(g.head)}" width="${px(g.measure)}" height="${px(g.extent)}"/>
    <text class="draw-label draw-toned tone-blue" x="${w / 2}" y="${px(6)}" text-anchor="middle">Head · ${g.head} mm</text>
    <text class="draw-label draw-toned tone-blue" x="${w / 2}" y="${h - px(6)}" text-anchor="middle">Foot · ${g.foot} mm</text>
    <text class="draw-label draw-toned tone-blue" transform="translate(${left / 2} ${h / 2}) rotate(-90)" text-anchor="middle">${side[0]} · ${leaf.number % 2 ? g.gutter : g.fore} mm</text>
    <text class="draw-label draw-toned tone-blue" transform="translate(${w - px(leaf.number % 2 ? g.fore : g.gutter) / 2} ${h / 2}) rotate(90)" text-anchor="middle">${side[1]} · ${leaf.number % 2 ? g.fore : g.gutter} mm</text>
  </svg>`;
}

export function bookPreview(proof, { guides = false } = {}) {
  const { geometry: g } = proof;
  const base = `./book-proofs/${proof.lang}-${proof.format}-${proof.mode}/`;
  const leaves = guides ? proof.pages.slice(proof.folios[1], proof.folios[1] + 2) : proof.pages;
  const spreads = [];
  for (const leaf of leaves) {
    if (!spreads.length || leaf.number % 2 === 0) spreads.push([]);
    spreads.at(-1).push(leaf);
  }
  return `<main class="book-proof" style="${bookVariables(g)}" lang="en">
    <header class="paper-head"><p class="eyebrow">BOOK / ${g.name.toUpperCase()} / LEFT BINDING</p>
      <h1>${guides ? 'Page anatomy' : 'Book typesetting'}</h1>
      <p class="note">${guides ? 'The blue rectangle is the type area (<span lang="ja">版面</span>). Head (<span lang="ja">天</span>), foot (<span lang="ja">地</span>), fore-edge (<span lang="ja">小口</span>) and gutter (<span lang="ja">ノド</span>) sit outside it. Running heads (<span lang="ja">柱</span>) sit above the type area; folios (<span lang="ja">ノンブル</span>) sit below it at the outer edges.' : 'Actual pages from the printed HTML, paired as even-left / odd-right spreads. Blank versos, chapter starts, running heads and contents folios come from pagination. Open a page to inspect the selectable PDF, or read the reflowing HTML.'}</p>
    </header>
    <ul class="ribbon"><li><b>Trim</b> ${g.name} · ${g.width} × ${g.height} mm</li><li><b>Type area</b> ${g.measure} × ${g.extent} mm</li><li><b>Body</b> 12 pt / ${g.leading} mm leading</li><li><b>Margins</b> Head ${g.head} · foot ${g.foot} · gutter ${g.gutter} · fore-edge ${g.fore} mm</li><li><b>Extent</b> ${proof.pages.length} pages</li></ul>
    <div class="actions"><a class="btn" href="${base}book.pdf" target="_blank" rel="noopener">Open PDF</a><a href="${base}book.html" target="_blank" rel="noopener">Read HTML</a><a href="${base}book.html" download>Download self-contained HTML</a></div>
    ${spreads.map(spread => `<div class="book-spread-wrap" tabindex="0" role="region" aria-label="${spread.length === 1 ? 'Page' : 'Pages'} ${spread.map(p => p.number).join('–')}"><div class="book-spread">${spread.map(leaf => {
      const src = `${base}page-${leaf.number}.png`;
      return `<figure class="book-leaf" data-dd-side="${leaf.number % 2 ? 'right' : 'left'}"><a href="${base}book.pdf#page=${leaf.number}" target="_blank" rel="noopener" aria-label="Open page ${leaf.number}${leaf.blank ? ', intentionally blank verso' : ''} in PDF">${guides ? anatomy(leaf, g, src) : `<img src="${src}" width="${Math.round(leaf.width * 2)}" height="${Math.round(leaf.height * 2)}" alt="${escape(proof.title)} — page ${leaf.number}${leaf.blank ? ' (intentionally blank verso)' : ''}" lang="${proof.lang}" loading="lazy">`}</a></figure>`;
    }).join('')}</div></div>`).join('')}
  </main>`;
}
