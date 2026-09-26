import test from 'node:test';
import assert from 'node:assert/strict';
import { validateHtml } from '../src/validate.mjs';

const page = (body, head = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><style>.a{color:red}</style>${head}</head><body>${body}</body></html>`;

test('a plain page passes', () => {
  assert.deepEqual(validateHtml(page('<article class="sheet"><p>ok</p><a href="https://example.com/x">x</a><a href="#top">top</a></article>')).problems, []);
});

for (const [name, html, expected] of [
  ['script element', page('<script>alert(1)</script>'), /script/],
  ['event handler', page('<p onclick="x()">a</p>'), /event handler/],
  ['javascript href', page('<a href="javascript:alert(1)">a</a>'), /javascript:/],
  ['http href', page('<a href="http://example.com">a</a>'), /http:/],
  ['relative href', page('<a href="/etc/passwd">a</a>'), /not an absolute https URL/],
  ['iframe', page('<iframe src="https://x"></iframe>'), /<iframe>/],
  ['object', page('<object data="x"></object>'), /<object>/],
  ['embed', page('<embed src="x">'), /<embed>/],
  ['form', page('<form action="https://x"><input></form>'), /<form>/],
  ['base', page('', '<base href="https://evil/">'), /<base>/],
  ['meta refresh', page('', '<meta http-equiv="refresh" content="0;url=https://x">'), /http-equiv=refresh/],
  ['external stylesheet', page('', '<link rel="stylesheet" href="https://x/a.css">'), /<link>/],
  ['image', page('<img src="https://x/a.png">'), /<img>/],
  ['css import', `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><style>@import url(https://x);</style></head><body></body></html>`, /forbidden construct/],
  ['css external url', `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><style>.a{background:url(https://x/a.png)}</style></head><body></body></html>`, /external resource/],
  ['css behavior', `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><style>.a{behavior:url(#default#x)}</style></head><body></body></html>`, /forbidden construct/],
  ['arbitrary inline style', page('<p style="background:url(https://x)">a</p>'), /style attribute/],
  ['svg use', page('<svg><use href="#x"/></svg>'), /<use>/],
  ['svg image', page('<svg><image href="https://x"/></svg>'), /<image>/],
  ['svg foreignObject', page('<svg><foreignObject></foreignObject></svg>'), /foreignobject/i],
  ['svg script', page('<svg><script>1</script></svg>'), /script/],
  ['svg handler', page('<svg><rect onload="x()"/></svg>'), /event handler/],
  ['svg fill', page('<svg><rect fill="red"/></svg>'), /fill must be/],
  ['svg href', page('<svg><a href="https://x">y</a></svg>'), /<a>/],
  ['second style', page('<style>.b{}</style>'), /exactly one <style>/],
  ['missing lang', '<!doctype html><html><head><meta charset="utf-8"><title>t</title><style></style></head><body></body></html>', /lang/],
  ['missing charset', '<!doctype html><html lang="en"><head><title>t</title><style></style></head><body></body></html>', /charset/],
  ['details with handler', page('<details ontoggle="x()"><summary>s</summary></details>'), /event handler/],
  ['unknown attribute', page('<p data-x="1">a</p>'), /attribute data-x/],
]) {
  test(`rejects ${name}`, () => {
    const result = validateHtml(html);
    assert.equal(result.ok, false, name);
    assert.ok(result.problems.some((p) => expected.test(p)), `${name}: ${result.problems.join(' | ')}`);
  });
}

test('doc-ui inline styles and SVG marks are allowed', () => {
  const html = page(`<svg class="draw-defs" aria-hidden="true" focusable="false"><marker id="dd-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 8 6" refX="8" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><path class="draw-arrowhead" d="M0 0L8 3L0 6Z"/></marker></svg>
    <svg class="draw" style="--dd-draw-width:56px" viewBox="0 0 56 16" aria-hidden="true"><path class="draw-line draw-arrow tone-accent" d="M2 8H54"/><rect fill="none" x="0" y="0" width="1" height="1"/><text x="1" y="1" text-anchor="middle" class="draw-label">a</text></svg>
    <span class="meter-part tone-ok" style="--dd-part:4%"></span><ol class="flow" style="--dd-flow-steps:3"></ol><span class="hole" data-dd-hint="x">y</span>`);
  assert.deepEqual(validateHtml(html).problems, []);
});
