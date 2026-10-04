import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, linkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = join(root, 'dist/cli.mjs');
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const run = (args, input = '') => spawnSync(process.execPath, [cli, ...args], { input, encoding: 'utf8' });
const temp = t => {
  const dir = mkdtempSync(join(tmpdir(), 'doc-ui-cli-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};

test('CLI reads stdin, embeds the shipped CSS and writes only HTML to stdout', () => {
  for (const args of [[], ['-'], ['-', '-o', '-']]) {
    const result = run(args, '# Hello\n\nA document.');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /^<!doctype html>/);
    assert.match(result.stdout, /<h1 id="hello">Hello<\/h1>/);
    assert(result.stdout.includes(readFileSync(join(root, 'dist/document-design.min.css'), 'utf8')));
    assert.doesNotMatch(result.stdout, /<script|<link rel="stylesheet"/);
  }
  assert.equal(run(['--version']).stdout, `${version}\n`);
  assert.match(run(['--help']).stdout, /Usage: doc-ui/);
});

test('file output supports spaces, creates parents, rebases images, and keeps the source', t => {
  const dir = temp(t);
  const input = join(dir, 'input file.md');
  const output = join(dir, 'out/result.html');
  const source = '# 日本語\n\n![Image](./image.png)';
  writeFileSync(input, source);
  const result = run([input, '-o', output, '--layout', 'book', '--lang', 'ja']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.match(readFileSync(output, 'utf8'), /src="..\/image.png"/);
  assert.match(readFileSync(output, 'utf8'), /lang="ja"/);
  assert.equal(readFileSync(input, 'utf8'), source);
  assert.equal(run([input, '-o', input]).status, 1);
  const alias = join(dir, 'alias.md');
  linkSync(input, alias);
  assert.equal(run([input, '-o', alias]).status, 1);
  assert.equal(readFileSync(input, 'utf8'), source);
});

test('invalid arguments and I/O errors return nonzero without partial HTML', t => {
  const dir = temp(t);
  for (const args of [['--layout', 'oops'], [join(dir, 'missing.md')], ['-', '-o', dir]]) {
    const result = run(args, '# Text');
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^doc-ui: /);
    assert.doesNotMatch(result.stderr, /\n\s+at /);
  }
});

test('packed npm distribution runs through npx outside the workspace without dependencies', t => {
  const dir = temp(t);
  const packed = spawnSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', dir], { cwd: root, encoding: 'utf8' });
  assert.equal(packed.status, 0, packed.stderr);
  const [pkg] = JSON.parse(packed.stdout);
  const paths = pkg.files.map(file => file.path);
  for (const path of ['dist/cli.mjs', 'dist/document-design.min.css', 'dist/CLI-NOTICES.txt', 'LICENSE']) assert(paths.includes(path), path);
  assert.equal(pkg.files.find(file => file.path === 'dist/cli.mjs').mode & 0o111, 0o111);
  const notices = readFileSync(join(root, 'dist/CLI-NOTICES.txt'), 'utf8');
  for (const name of ['markdown-it', 'entities', 'linkify-it', 'mdurl', 'punycode.js', 'uc.micro']) assert(notices.includes(`${name}@`), name);
  assert(!notices.includes('argparse@'), 'markdown-it CLI is not part of our renderer');
  const executed = spawnSync('npx', ['--yes', '--offline', '--ignore-scripts', '--cache', join(dir, 'cache'), '--package', join(dir, pkg.filename), 'doc-ui', '--layout', 'paper'], {
    cwd: dir, input: '# Packed document\n\nWorks offline.', encoding: 'utf8', timeout: 30000,
  });
  assert.equal(executed.status, 0, executed.stderr);
  assert.match(executed.stdout, /<h1 id="packed-document">Packed document<\/h1>/);
  assert.match(executed.stdout, /class="sheet sheet-paper"/);
  assert.match(executed.stdout, /@layer dd/);
});
