import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { renderMarkdown } from '../src/cli/render.mjs';
import { parseOptions } from '../src/cli/options.mjs';

function nodes(root) { return [root, ...(root.childNodes ?? []).flatMap(nodes)]; }
const elements = (html, tag) => nodes(parse(html)).filter(node => node.tagName === tag);
const attr = (node, name) => node.attrs.find(attr => attr.name === name)?.value;
const content = node => node.value ?? (node.childNodes ?? []).map(content).join('');

test('Markdown preserves nested blocks, inline formatting, tables, code, links and tasks', () => {
  const html = renderMarkdown(`# Catalog *overview*

Text with **weight**, ~~removed~~, [link](https://example.com) and \`code\`.

> Quoted text
>
> - Nested list

| Name | Findings |
| :--- | ---: |
| WordPress | 978 |

\`\`\`html
<script>text only</script>
\`\`\`

- [x] Read **catalog**
- [ ] Inspect [findings](#findings)

## Findings
`);
  assert.equal(content(elements(html, 'title')[0]), 'Catalog overview');
  assert.equal(elements(html, 'strong').length, 2);
  assert.equal(elements(html, 's').length, 1);
  assert.equal(elements(html, 'blockquote').length, 1);
  assert.equal(elements(html, 'table').length, 1);
  assert.equal(attr(elements(html, 'td')[1], 'style'), 'text-align:right');
  assert.equal(content(elements(html, 'pre')[0]), '<script>text only</script>\n');
  assert.equal(elements(html, 'script').length, 0);
  const tasks = elements(html, 'input');
  assert.equal(tasks.length, 2);
  assert.equal(attr(tasks[0], 'disabled'), '');
  assert.equal(attr(tasks[0], 'checked'), '');
  assert.equal(attr(tasks[1], 'checked'), undefined);
  assert.equal(attr(tasks[0], 'aria-label'), 'Read catalog');
  assert.equal(attr(elements(html, 'h2')[0], 'id'), 'findings');
});

test('report and book split only top-level H2s, retaining all content once', () => {
  const source = '# Title\n\nOpening.\n\n## First\n\nBody.\n\n> ## Quoted\n> Quote.\n\n- ## Listed\n\n## Second\n\nEnding.';
  for (const layout of ['doc', 'report', 'paper', 'book']) {
    const html = renderMarkdown(source, { layout });
    assert.equal(elements(html, 'h1').length, 1, layout);
    assert.equal(elements(html, 'h2').length, 4, layout);
    assert.equal(elements(html, 'blockquote').length, 1, layout);
    assert.equal(elements(html, 'li').length, 1, layout);
    assert.match(content(elements(html, 'body')[0]), /Opening\.[\s\S]*Body\.[\s\S]*Quote\.[\s\S]*Ending\./);
    const sections = elements(html, 'section');
    if (layout === 'book') assert.equal(sections.filter(n => attr(n, 'class')?.includes('book-page')).length, 3);
    if (layout === 'report') {
      assert.equal(sections.filter(n => attr(n, 'class') === 'sec').length, 2);
      assert.equal(elements(html, 'h2').filter(n => attr(n, 'class') === 'lead').length, 2);
    }
  }
});

test('empty input, missing title, setext headings and repeated headings are valid', () => {
  for (const layout of ['doc', 'report', 'paper', 'book']) {
    assert.equal(elements(renderMarkdown('', { layout }), 'main').length, 1);
    assert.equal(elements(renderMarkdown('## Chapter\n\nText', { layout }), 'h1').length, 0);
  }
  const html = renderMarkdown('Title\n=====\n\n## A\n\n## A\n\n## A-1\n\n## 日本語\n\n## 日本語');
  assert.deepEqual(elements(html, 'h2').map(n => attr(n, 'id')), ['a', 'a-1', 'a-1-1', '日本語', '日本語-1']);
  assert.equal(content(elements(html, 'title')[0]), 'Title');
});

test('metadata and default Markdown cannot inject executable HTML or unsafe URLs', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n[click](javascript:alert(1))\n\n![image](x"onerror="alert(1))', {
    title: '</title><script>alert(2)</script>', lang: 'en" onload="alert(3)',
  });
  assert.equal(elements(html, 'script').length, 0);
  assert.equal(attr(elements(html, 'html')[0], 'onload'), undefined);
  for (const node of nodes(parse(html))) {
    assert(!node.attrs?.some(a => a.name.startsWith('on')));
    assert(!node.attrs?.some(a => a.name === 'href' && a.value.startsWith('javascript:')));
  }
  assert.equal(content(elements(html, 'title')[0]), '</title><script>alert(2)</script>');
  assert.equal(elements(renderMarkdown('<aside class="caveat">Unknown</aside>', { html: true }), 'aside').length, 1);
});

test('relative links are rebased for output directories without changing other URLs', () => {
  const html = renderMarkdown('[local](./a%20b.md?x=1#part) ![alt](images/図.png) [fragment](#title) [web](https://example.com/a) [root](/a)', {
    sourceDir: '/project/docs', outputDir: '/project/output',
  });
  assert.deepEqual(elements(html, 'a').map(n => attr(n, 'href')), [
    '../docs/a%20b.md?x=1#part', '#title', 'https://example.com/a', '/a',
  ]);
  assert.equal(attr(elements(html, 'img')[0], 'src'), '../docs/images/%E5%9B%B3.png');
  assert.equal(attr(elements(renderMarkdown('[local](./a.md)'), 'a')[0], 'href'), './a.md');
});

test('options select existing doc-ui contracts and reject misspellings', () => {
  const options = parseOptions(['--layout', 'paper', '--lang', 'ja-JP', '--theme', 'dark', '--color', 'monochrome', '--paper', 'a4', '--print-urls', 'none']);
  const root = elements(renderMarkdown('# 日本語', options), 'html')[0];
  for (const [name, value] of Object.entries({ lang: 'ja-JP', 'data-dd-theme': 'dark', 'data-dd-color': 'monochrome', 'data-dd-paper': 'a4', 'data-dd-print-urls': 'none' })) {
    assert.equal(attr(root, name), value);
  }
  for (const args of [['--layout', 'unknown'], ['--theme', 'automatic'], ['--color', 'red'], ['--paper', 'a3'], ['--print-urls', 'all'], ['--lang', 'bad_tag'], ['--lang', ''], ['--typo'], ['a.md', 'b.md'], ['--output']]) {
    assert.throws(() => parseOptions(args), args.join(' '));
  }
  assert.equal(parseOptions(['--', '-file.md']).input, '-file.md');
});
