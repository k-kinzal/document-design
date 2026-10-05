import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-C_aFEijI.js";function r(e){return Object.entries(e).filter(([,e])=>typeof e==`number`).map(([e,t])=>`--dd-book-${e.replace(/[A-Z]/g,e=>`-`+e.toLowerCase())}: ${t}mm`).join(`; `)}function i(){return(i=e((()=>{})))()}function a(e,t,n){let r=e=>e*96/25.4,i=r(t.width),a=r(t.height),o=r(e.number%2?t.gutter:t.fore),s=e.number%2?[`Gutter`,`Fore-edge`]:[`Fore-edge`,`Gutter`];return`<svg class="draw" style="--dd-draw-width: ${i}px" viewBox="0 0 ${i} ${a}" role="img" aria-label="Page ${e.number}: trim, type area, head, foot, gutter and fore-edge">
    <image href="${n}" width="${i}" height="${a}"/>
    <rect class="draw-box-alt tone-blue" x="${o}" y="${r(t.head)}" width="${r(t.measure)}" height="${r(t.extent)}"/>
    <text class="draw-label draw-toned tone-blue" x="${i/2}" y="${r(6)}" text-anchor="middle">Head · ${t.head} mm</text>
    <text class="draw-label draw-toned tone-blue" x="${i/2}" y="${a-r(6)}" text-anchor="middle">Foot · ${t.foot} mm</text>
    <text class="draw-label draw-toned tone-blue" transform="translate(${o/2} ${a/2}) rotate(-90)" text-anchor="middle">${s[0]} · ${e.number%2?t.gutter:t.fore} mm</text>
    <text class="draw-label draw-toned tone-blue" transform="translate(${i-r(e.number%2?t.fore:t.gutter)/2} ${a/2}) rotate(90)" text-anchor="middle">${s[1]} · ${e.number%2?t.fore:t.gutter} mm</text>
  </svg>`}function o(e,{guides:t=!1}={}){let{geometry:n}=e,i=`./book-proofs/${e.lang}-${e.format}-${e.mode}/`,o=t?e.pages.slice(e.folios[1],e.folios[1]+2):e.pages,c=[];for(let e of o)(!c.length||e.number%2==0)&&c.push([]),c.at(-1).push(e);return`<main class="book-proof" style="${r(n)}" lang="en">
    <header class="paper-head"><p class="eyebrow">BOOK / ${n.name.toUpperCase()} / LEFT BINDING</p>
      <h1>${t?`Page anatomy`:`Book typesetting`}</h1>
      <p class="note">${t?`The blue rectangle is the type area (<span lang="ja">版面</span>). Head (<span lang="ja">天</span>), foot (<span lang="ja">地</span>), fore-edge (<span lang="ja">小口</span>) and gutter (<span lang="ja">ノド</span>) sit outside it. Running heads (<span lang="ja">柱</span>) sit above the type area; folios (<span lang="ja">ノンブル</span>) sit below it at the outer edges.`:`Actual pages from the printed HTML, paired as even-left / odd-right spreads. Blank versos, chapter starts, running heads and contents folios come from pagination. Open a page to inspect the selectable PDF, or read the reflowing HTML.`}</p>
    </header>
    <ul class="ribbon"><li><b>Trim</b> ${n.name} · ${n.width} × ${n.height} mm</li><li><b>Type area</b> ${n.measure} × ${n.extent} mm</li><li><b>Body</b> 12 pt / ${n.leading} mm leading</li><li><b>Margins</b> Head ${n.head} · foot ${n.foot} · gutter ${n.gutter} · fore-edge ${n.fore} mm</li><li><b>Extent</b> ${e.pages.length} pages</li></ul>
    <div class="actions"><a class="btn" href="${i}book.pdf" target="_blank" rel="noopener">Open PDF</a><a href="${i}book.html" target="_blank" rel="noopener">Read HTML</a><a href="${i}book.html" download>Download self-contained HTML</a></div>
    ${c.map(r=>`<div class="book-spread-wrap" tabindex="0" role="region" aria-label="${r.length===1?`Page`:`Pages`} ${r.map(e=>e.number).join(`–`)}"><div class="book-spread">${r.map(r=>{let o=`${i}page-${r.number}.png`;return`<figure class="book-leaf" data-dd-side="${r.number%2?`right`:`left`}"><a href="${i}book.pdf#page=${r.number}" target="_blank" rel="noopener" aria-label="Open page ${r.number}${r.blank?`, intentionally blank verso`:``} in PDF">${t?a(r,n,o):`<img src="${o}" width="${Math.round(r.width*2)}" height="${Math.round(r.height*2)}" alt="${s(e.title)} — page ${r.number}${r.blank?` (intentionally blank verso)`:``}" lang="${e.lang}" loading="lazy">`}</a></figure>`}).join(``)}</div></div>`).join(``)}
  </main>`}var s;function c(){return(c=e((()=>{i(),s=e=>String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])})))()}function l({lang:e=`en`,format:n=`a5`,mode:r=`mixed`,guides:i=!1}={}){return{loaders:[async()=>{let t=await fetch(`./book-proofs/${e}-${n}-${r}/index.json`);if(!t.ok)throw Error(`Book proofs are missing. Run npm run build:book-proofs.`);return{proof:await t.json()}}],render:(e,{loaded:n})=>t`${o(n.proof,{guides:i})}`}}var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),c(),u={title:`Examples/Book`,parameters:{docs:{description:{component:`A format-led book proof, generated from doc-ui HTML with native MathML, an SVG plot, tables and raster plates. A5 is 148 × 210 mm; its type area is 110 × 168 mm, with a 20 mm gutter, 18 mm fore-edge, 18 mm head and 24 mm foot. These margins are editorial choices, not requirements of the paper standard. Even pages have the book title at the outer head; odd pages have the current chapter title. Folios sit outside the type area. Chapters start on rectos; intentionally blank versos carry no furniture. The generation pass prints the actual HTML, inserts necessary blanks, resolves TOC folios and renders these proof images. Open PDF for selectable text, or download HTML for script-free offline reading and printing. Rebuild proofs after changing content, fonts, geometry or CSS. bookGeometry(), bookVariables() and bookPageCSS() from @k-kinzal/doc-ui/book are optional helpers that emit ordinary CSS. Neutral pages desaturate images; genuinely bitonal images need bitonal source artwork.`}}}},d={name:`A5 · Mixed pages`,...l()},f={name:`Japanese · A5`,...l({lang:`ja`})},p={name:`Page anatomy · A5`,...l({guides:!0})},m={name:`A4 · Mixed pages`,...l({format:`a4`})},h={name:`Japanese · JIS B6`,...l({lang:`ja`,format:`b6-jis`})},g={name:`A5 · Grayscale`,...l({mode:`grayscale`})},_={name:`A5 · Monochrome`,...l({mode:`monochrome`})},v=[`MixedPages`,`Japanese`,`PageAnatomy`,`A4`,`JapaneseB6`,`Grayscale`,`Monochrome`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'A5 · Mixed pages',
  ...proof()
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Japanese · A5',
  ...proof({
    lang: 'ja'
  })
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Page anatomy · A5',
  ...proof({
    guides: true
  })
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'A4 · Mixed pages',
  ...proof({
    format: 'a4'
  })
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Japanese · JIS B6',
  ...proof({
    lang: 'ja',
    format: 'b6-jis'
  })
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'A5 · Grayscale',
  ...proof({
    mode: 'grayscale'
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'A5 · Monochrome',
  ...proof({
    mode: 'monochrome'
  })
}`,..._.parameters?.docs?.source}}}})))()}y();export{m as A4,g as Grayscale,f as Japanese,h as JapaneseB6,d as MixedPages,_ as Monochrome,p as PageAnatomy,v as __namedExportsOrder,u as default};