import test from 'node:test';
import assert from 'node:assert/strict';
import { escape, links } from '../src/render.mjs';
import { validateHtml } from '../src/validate.mjs';
import { renderSample, sampleCss } from './fixtures/sample.mjs';

test('the page is one self-contained document that passes the allowlist', () => {
  const html = renderSample();
  const css = sampleCss();
  assert.match(html, /^<!doctype html>\n<html lang="en">/);
  assert.match(html, /<meta charset="utf-8">/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy"/);
  assert.equal((html.match(/<style>/g) ?? []).length, 1);
  assert.ok(!/<script/i.test(html));
  assert.ok(!/<link/i.test(html));
  assert.ok(html.includes(css.slice(0, 200)));
  assert.ok(html.includes('MIT License'), 'the stylesheet license banner travels with the page');
  const result = validateHtml(html);
  assert.deepEqual(result.problems, []);
});

test('model text is escaped and links are built from the evidence, never from the model', () => {
  const html = renderSample();
  assert.ok(html.includes('It read the stream directly &amp; parsed it, which meant every caller had to know the stream format (bytes &gt; tokens)'));
  assert.ok(html.includes('Change &lt;things&gt; &amp; more'));
  assert.ok(html.includes('href="https://github.com/octo/consumer/blob/' + 'b'.repeat(40) + '/src/a%20%26%20b.php"'));
  assert.ok(html.includes('href="https://github.com/octo/consumer/blob/' + 'a'.repeat(40) + '/gone.txt"'), 'deleted files link to the base tree');
  assert.ok(html.includes('href="https://github.com/octo/consumer/commit/' + 'b'.repeat(40) + '"'));
  assert.ok(html.includes('compare/' + 'a'.repeat(40) + '..' + 'b'.repeat(40)));
});

test('the sheet uses doc-ui vocabulary: hero claim, sections with rails, compare, flow, facts, caveat, evidence table, provenance', () => {
  const html = renderSample();
  for (const needle of ['<article class="sheet" lang="en">', 'class="eyebrow"', 'class="hero"', 'class="claim"', 'class="unit"', 'class="sec" id="sec-intent"', 'class="rail"', 'class="sidenote"', 'class="lead"', 'class="compare"', 'class="flow" style="--dd-flow-steps:3"', 'class="definitions"', 'class="caveat"', 'id="sec-findings"', 'id="sec-migration"', 'id="sec-evidence"', 'class="timeline"', 'plate plate-full plate-table', 'id="sec-provenance"', 'class="facts"', 'class="draw-defs"']) {
    assert.ok(html.includes(needle), needle);
  }
  assert.match(html, /2 of 9 hunks read/);
  assert.match(html, /Hunks dropped from files that exceeded their share of the input budget\. \(7\)/);
  assert.match(html, /fake-model-1/);
  assert.match(html, /1\.0\.88/);
  assert.match(html, /docs\/old\.md → docs\/a-very-long/);
});

test('Japanese pages carry lang="ja" and Japanese labels', () => {
  const html = renderSample({ language: 'ja' });
  assert.match(html, /^<!doctype html>\n<html lang="ja">/);
  assert.ok(html.includes('<article class="sheet" lang="ja">'));
  for (const label of ['変更レポート', '変更前', '変更後', '意図', '構造', '検証', '所見', '根拠', '生成情報', '一部省略', '移行手順']) assert.ok(html.includes(label), label);
  assert.deepEqual(validateHtml(html).problems, []);
});

test('an empty comparison renders without a model and says so', () => {
  const html = renderSample({ empty: true });
  assert.ok(html.includes('class="empty"'));
  assert.ok(html.includes('No changes'));
  assert.ok(!html.includes('class="hero"'));
  assert.deepEqual(validateHtml(html).problems, []);
  const ja = renderSample({ empty: true, language: 'ja' });
  assert.ok(ja.includes('変更なし'));
});

test('escape covers the five characters', () => {
  assert.equal(escape(`<a href="x" title='y'>&</a>`), '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
});

test('links use three-dot compare for merge-base comparisons and nothing without a repository', () => {
  const l = links({ serverUrl: 'https://github.com', repository: 'o/r', base: { sha: 'a' }, head: { sha: 'b' }, rule: 'pr-merge-base' });
  assert.equal(l.compare, 'https://github.com/o/r/compare/a...b');
  const none = links({ serverUrl: 'https://github.com', repository: null, base: { sha: 'a' }, head: { sha: 'b' }, rule: 'range-direct' });
  assert.equal(none.compare, null);
  assert.equal(none.commit('a'), null);
});
