import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stage, publish, exportPages } from '../src/pages.mjs';

function fixture(t) {
  const temp = mkdtempSync(join(tmpdir(), 'doc-publication-test-'));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const archive = join(temp, 'archive');
  const read = file => readFileSync(join(archive, file), 'utf8');
  const manifest = () => JSON.parse(read('versions.json'));
  let sequence = 0;
  function build(version, letter) {
    const commit = letter.repeat(40);
    const source = join(temp, `source-${++sequence}`);
    const input = join(temp, `build-${sequence}`);
    function write(file, content) {
      mkdirSync(join(source, file, '..'), { recursive: true });
      writeFileSync(join(source, file), content);
    }
    write('packages/doc-ui/package.json', JSON.stringify({ version }));
    write('packages/doc-ui/dist/document-design.css', `/* ${version} ${commit} */`);
    write('packages/doc-site/dist/index.html', `<link rel="stylesheet" href="./v${version}/document-design.css">${version}`);
    write('packages/doc-site/dist/ja/index.html', version);
    write('packages/doc-site/dist/latest/document-design.css', 'must not replace main');
    write(`packages/doc-site/dist/v${version}/document-design.css`, 'standalone copy');
    write('packages/doc-ui/storybook-static/index.html', version);
    write('DESIGN.md', version);
    write('LICENSE', 'MIT License');
    stage(source, input, commit);
    return { input, commit, version };
  }
  const main = (build, tip = build.commit) => publish(build.input, archive, { ref: 'refs/heads/main', mainCommit: tip });
  const release = build => publish(build.input, archive, { ref: `refs/tags/v${build.version}`, mainCommit: build.commit });
  return { temp, archive, read, manifest, build, main, release };
}

test('main snapshots do not publish a product page; releases pin the single site', t => {
  const f = fixture(t);
  const first = f.build('1.0.0', 'a');
  f.main(first);
  assert.equal(f.manifest().site, null);
  assert(!existsSync(join(f.archive, 'index.html')));
  f.release(first);
  const css = f.read('v1.0.0/document-design.css');
  for (const path of ['v1.0', 'v1', first.commit, 'latest']) assert.equal(f.read(`${path}/document-design.css`), css);
  assert.equal(f.manifest().site.tag, 'v1.0.0');
  assert.match(f.read('index.html'), /\.\/v1\.0\.0\/document-design\.css/);
  const homepage = f.read('index.html');
  const next = f.build('1.0.0', 'b');
  f.main(next);
  assert.equal(f.read('index.html'), homepage);
  assert.equal(f.read('storybook/index.html'), '1.0.0');
  assert.equal(f.read('v1/document-design.css'), css);
  assert.equal(f.read(`${first.commit}/document-design.css`), css);
  assert.notEqual(f.read('latest/document-design.css'), css);
  assert.equal(f.manifest().main.commit, next.commit);
  assert.equal(f.read('LICENSE'), 'MIT License');
});

test('maintenance and out-of-order tags update only the appropriate release aliases', t => {
  const f = fixture(t);
  for (const [version, sha] of [['1.0.0', 'a'], ['1.1.0', 'b'], ['1.0.2', 'c'], ['1.10.0', 'd'], ['1.9.0', 'e']]) {
    f.release(f.build(version, sha));
  }
  assert.equal(f.read('v1/document-design.css'), f.read('v1.10.0/document-design.css'));
  assert.equal(f.read('v1.0/document-design.css'), f.read('v1.0.2/document-design.css'));
  assert.equal(f.read('v1.9/document-design.css'), f.read('v1.9.0/document-design.css'));
  assert.equal(f.manifest().site.tag, 'v1.10.0');
  assert.match(f.read('index.html'), /v1\.10\.0/);
  f.release(f.build('2.0.0', 'f'));
  assert.equal(f.read('v1/document-design.css'), f.read('v1.10.0/document-design.css'));
  assert.equal(f.manifest().site.tag, 'v2.0.0');
});

test('immutable commit and release paths reject changed bytes and moved tags', t => {
  const f = fixture(t);
  const first = f.build('1.0.0', 'a');
  f.main(first);
  f.release(first);
  const before = f.read('versions.json');
  writeFileSync(join(first.input, 'ui/document-design.css'), 'changed');
  assert.throws(() => f.main(first), /immutable distribution/);
  assert.throws(() => f.release(first), /immutable distribution/);
  assert.throws(() => f.release(f.build('1.0.0', 'b')), /another commit/);
  assert.equal(f.read('versions.json'), before);
});

test('publication validates stable tags, package versions, and full commit IDs', t => {
  const f = fixture(t);
  const first = f.build('1.0.0', 'a');
  for (const ref of ['refs/heads/feature', 'refs/tags/v1', 'refs/tags/v1.0.0-beta.1']) {
    assert.throws(() => publish(first.input, f.archive, { ref }), /stable vX.Y.Z/);
  }
  assert.throws(() => publish(first.input, f.archive, { ref: 'refs/tags/v1.0.1' }), /does not match/);
  writeFileSync(join(first.input, 'build.json'), JSON.stringify({ version: '1.0.0', commit: 'abc1234' }));
  assert.throws(() => f.main(first), /40-character/);
  assert(!existsSync(f.archive));
});

test('release reruns are idempotent and new sites remove obsolete pages without losing archives', t => {
  const f = fixture(t);
  const first = f.build('1.0.0', 'a');
  writeFileSync(join(first.input, 'site/obsolete.html'), 'old page');
  f.main(first);
  f.release(first);
  const before = f.read('versions.json');
  f.release(first);
  assert.equal(f.read('versions.json'), before);
  f.release(f.build('1.0.1', 'b'));
  assert(!existsSync(join(f.archive, 'obsolete.html')));
  assert(existsSync(join(f.archive, 'v1.0.0/document-design.css')));
  assert(existsSync(join(f.archive, first.commit, 'document-design.css')));
  assert.equal(f.read('latest/document-design.css'), f.read(`${first.commit}/document-design.css`));
});

test('delayed main runs preserve latest; exports omit worktree metadata', t => {
  const f = fixture(t);
  const current = f.build('1.0.0', 'b');
  f.main(current);
  const delayed = f.build('1.0.0', 'a');
  f.main(delayed, current.commit);
  assert.equal(f.manifest().main.commit, current.commit);
  assert(existsSync(join(f.archive, delayed.commit, 'document-design.css')));
  writeFileSync(join(f.archive, '.git'), 'private worktree path');
  const exported = join(f.temp, 'pages');
  exportPages(f.archive, exported);
  assert(!existsSync(join(exported, '.git')));
  assert(existsSync(join(exported, '.nojekyll')));
  assert.equal(readFileSync(join(exported, 'versions.json'), 'utf8'), f.read('versions.json'));
});
