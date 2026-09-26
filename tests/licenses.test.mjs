import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const lock = JSON.parse(read('package-lock.json'));

test('workspace licenses agree and the publishable package includes the MIT text', () => {
  assert.match(read('LICENSE'), /^MIT License\n\nCopyright \(c\) 2026 k-kinzal\n/);
  assert.equal(read('packages/doc-ui/LICENSE'), read('LICENSE'));
  for (const path of ['', 'packages/doc-ui/', 'packages/doc-site/', 'packages/doc-publish/', 'packages/doc-report/']) {
    assert.equal(JSON.parse(read(`${path}package.json`)).license, 'MIT', path);
  }
  const ui = JSON.parse(read('packages/doc-ui/package.json'));
  assert.deepEqual(ui.dependencies ?? {}, {}, 'doc-ui has no third-party runtime dependencies');
});

test('locked dependency licenses remain within the reviewed distribution scope', () => {
  const permissive = new Set(['MIT', 'Apache-2.0', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', '0BSD']);
  for (const [path, pkg] of Object.entries(lock.packages)) {
    if (!path.includes('node_modules/') || pkg.link) continue;
    const name = path.split('node_modules/').at(-1);
    const buildOrTestOnly = pkg.dev && (
      (pkg.license === 'MPL-2.0' && (name === 'axe-core' || /^lightningcss(?:-|$)/.test(name))) ||
      (pkg.license === 'CC-BY-4.0' && name === 'caniuse-lite')
    );
    assert(permissive.has(pkg.license) || buildOrTestOnly,
      `Review ${name}@${pkg.version}: ${pkg.license ?? 'missing license'}`);
  }
});
