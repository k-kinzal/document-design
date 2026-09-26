// The committed distribution must be what the source builds. This is a
// read-only check: it never rewrites dist/, so CI cannot "fix" main.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildDist } from '../build.mjs';
import { COPILOT_CLI_VERSION } from '../src/version.mjs';
import { packageRoot, repoRoot, tempDir } from './helpers.mjs';

test('dist/ matches a fresh build of src/ and the built doc-ui stylesheet', async (t) => {
  const { dir, cleanup } = tempDir();
  t.after(cleanup);
  await buildDist(dir);
  const committed = join(packageRoot, 'dist');
  const expected = readdirSync(dir).sort();
  assert.deepEqual(readdirSync(committed).sort(), expected);
  for (const name of expected) {
    const a = readFileSync(join(dir, name));
    const b = readFileSync(join(committed, name));
    assert.ok(a.equals(b), `${name} differs from a fresh build; run npm run build:report and commit dist/`);
  }
});

test('the distribution carries the license, the third-party notices and the doc-ui version', () => {
  const dist = join(packageRoot, 'dist');
  assert.equal(readFileSync(join(dist, 'LICENSE'), 'utf8'), readFileSync(join(repoRoot, 'LICENSE'), 'utf8'));
  const notices = readFileSync(join(dist, 'THIRD-PARTY-NOTICES.md'), 'utf8');
  assert.match(notices, /## parse5 /);
  assert.match(notices, /## entities /);
  const bundle = readFileSync(join(dist, 'report.mjs'), 'utf8');
  assert.match(bundle, /^\/\*!\n \* document-design-report/);
  assert.ok(bundle.includes(`"${COPILOT_CLI_VERSION}"`), 'the pinned CLI version is in the bundle');
  const ui = JSON.parse(readFileSync(join(repoRoot, 'packages/doc-ui/package.json'), 'utf8'));
  const [version, digest] = readFileSync(join(dist, 'VERSION'), 'utf8').trim().split('\n');
  assert.equal(version, ui.version);
  assert.match(digest, /^sha256:[0-9a-f]{64}$/);
  assert.match(readFileSync(join(dist, 'document-design.min.css'), 'utf8'), /^\/\*!\n \* MIT License/);
});
