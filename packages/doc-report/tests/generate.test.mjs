import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generate } from '../src/generate.mjs';
import { validateHtml } from '../src/validate.mjs';
import { fakeCopilot, fakeContext, fakeInputs, makeRepo, quiet, tempDir } from './helpers.mjs';

const TOKEN = 'ghs_verysecrettokenvalue0123456789abcdef';

function setup(t, { response = 'valid', extraEnv = {} } = {}) {
  const repo = makeRepo();
  const { dir, cleanup } = tempDir();
  t.after(() => { repo.cleanup(); cleanup(); });
  const record = join(dir, 'record.json');
  const env = { PATH: process.env.PATH, HOME: process.env.HOME, DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_RESPONSE: response, FAKE_COPILOT_RECORD: record, ...extraEnv };
  const context = fakeContext({ stateDir: join(dir, 'state'), runnerTemp: dir, actionPath: '' });
  return { repo, dir, env, record, context };
}

function twoCommits(repo) {
  const base = repo.commit({ 'src/app.php': "<?php\necho 'a';\n", 'README.md': '# Title\n' }, 'base');
  const head = repo.commit({ 'src/app.php': "<?php\necho 'b';\n", 'src/new.php': '<?php\n', 'README.md': '# Title\n\nMore.\n' }, 'improve output', { body: 'Explains the change.' });
  return { base, head };
}

test('a complete report: files, manifest, outputs, and no token anywhere', async (t) => {
  const { repo, env, record, context } = setup(t);
  const { base, head } = twoCommits(repo);
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, token: TOKEN }), context, env, log: quiet });
  assert.equal(state.status, 'complete', state.reason);
  assert.equal(state.upload, true);
  assert.equal(state.hasChanges, true);
  assert.equal(state.baseSha, base);
  assert.equal(state.headSha, head);
  assert.match(state.files.html, new RegExp(`^document-design-default-${head.slice(0, 7)}-4242-1\\.html$`));
  const html = readFileSync(state.reportPath, 'utf8');
  assert.deepEqual(validateHtml(html).problems, []);
  assert.ok(html.includes('One entry point for the generated pages'));
  assert.ok(html.includes('src/app.php'));
  assert.ok(!html.includes(TOKEN));
  const manifest = JSON.parse(readFileSync(state.manifestPath, 'utf8'));
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.reportId, 'default');
  assert.equal(manifest.mode, 'range');
  assert.equal(manifest.rule, 'range-direct');
  assert.equal(manifest.base.sha, base);
  assert.equal(manifest.head.sha, head);
  assert.equal(manifest.status, 'complete');
  assert.equal(manifest.generation.model, 'auto');
  assert.deepEqual(manifest.generation.modelsUsed, ['fake-model-1']);
  assert.equal(manifest.generation.attempts, 1);
  assert.equal(manifest.generation.promptVersion, '1');
  assert.equal(manifest.html.digest, state.htmlDigest);
  assert.equal(manifest.evidence.digest, state.evidenceDigest);
  assert.equal(manifest.docUi.version, '1.0.0');
  assert.equal(manifest.run.id, '4242');
  assert.equal(manifest.generator.ref, 'report-v1');
  assert.ok(!JSON.stringify(manifest).includes(TOKEN));
  const received = JSON.parse(readFileSync(record, 'utf8'));
  assert.ok(!received.prompt.includes(TOKEN));
  assert.ok(!received.args.join(' ').includes(TOKEN), 'the token is not a CLI argument');
  assert.equal(received.env.GITHUB_TOKEN, TOKEN);
  assert.ok(received.prompt.includes("echo 'b'"), 'the diff reaches the model');
  assert.ok(received.prompt.includes('Explains the change.'));
});

test('a Japanese report is generated in Japanese', async (t) => {
  const { repo, env, context, record } = setup(t);
  const { base, head } = twoCommits(repo);
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, language: 'ja' }), context, env, log: quiet });
  assert.equal(state.status, 'complete', state.reason);
  const html = readFileSync(state.reportPath, 'utf8');
  assert.match(html, /<html lang="ja">/);
  assert.ok(html.includes('生成物を一つの入口へまとめる'));
  assert.match(JSON.parse(readFileSync(record, 'utf8')).prompt, /Write every string in Japanese/);
});

test('an invalid answer is retried once with the validator\'s reasons, then fails without uploading', async (t) => {
  const { repo, env, context, record } = setup(t, { response: 'invalid' });
  const { base, head } = twoCommits(repo);
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, maxAttempts: 2 }), context, env, log: quiet });
  assert.equal(state.status, 'failed');
  assert.equal(state.upload, false);
  assert.match(state.reason, /did not return a valid report after 2 attempt/);
  const second = JSON.parse(readFileSync(record, 'utf8'));
  assert.match(second.prompt, /rejected by the validator/);
  assert.match(second.prompt, /standfirst is required/);
  assert.ok(existsSync(join(context.stateDir, 'attempt-2')));
});

for (const response of ['hallucinated', 'hostile', 'garbage']) {
  test(`a ${response} answer never becomes a page`, async (t) => {
    const { repo, env, context } = setup(t, { response });
    const { base, head } = twoCommits(repo);
    const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, maxAttempts: 1 }), context, env, log: quiet });
    assert.equal(state.status, 'failed');
    assert.equal(state.reportPath, undefined);
    assert.equal(readdirSync(join(context.stateDir, 'out')).length, 0);
  });
}

test('identical trees produce an empty report without a model, or a skip', async (t) => {
  const { repo, env, context, record } = setup(t);
  const { head } = twoCommits(repo);
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base: head, head }), context, env, log: quiet });
  assert.equal(state.status, 'empty');
  assert.equal(state.hasChanges, false);
  assert.ok(existsSync(state.reportPath));
  assert.ok(!existsSync(record), 'no model call');
  assert.ok(readFileSync(state.reportPath, 'utf8').includes('No changes'));
  const skipped = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base: head, head, onEmpty: 'skip' }), context: { ...context, stateDir: join(context.stateDir, 'b') }, env, log: quiet });
  assert.equal(skipped.status, 'skipped');
  assert.equal(skipped.upload, false);
});

test('fork pull requests are skipped with a reason', async (t) => {
  const { repo, env, context } = setup(t);
  const { base, head } = twoCommits(repo);
  const event = { pull_request: { number: 9, head: { sha: head, ref: 'f', repo: { full_name: 'someone/consumer' } }, base: { sha: base, ref: 'main', repo: { full_name: 'octo/consumer' } } } };
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'pr' }), context: { ...context, eventName: 'pull_request', event }, env, log: quiet });
  assert.equal(state.status, 'skipped');
  assert.equal(state.skipKind, 'fork');
  assert.equal(state.prNumber, 9);
});

test('a small input budget yields a partial report that says what was left out', async (t) => {
  const { repo, env, context } = setup(t);
  const files = {};
  for (let i = 0; i < 8; i++) files[`f${i}.txt`] = Array.from({ length: 60 }, (_, n) => `line ${n} ${'x'.repeat(50)}`).join('\n') + '\n';
  const base = repo.commit(files, 'base');
  const changed = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.replace(/line 3 /, 'line three ').replace(/line 40 /, 'line forty ')]));
  const head = repo.commit(changed, 'head');
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, maxInputBytes: 4000 }), context, env, log: quiet });
  assert.equal(state.status, 'partial', state.reason ?? undefined);
  const html = readFileSync(state.reportPath, 'utf8');
  assert.match(html, /Not everything was read/);
  const manifest = JSON.parse(readFileSync(state.manifestPath, 'utf8'));
  assert.equal(manifest.evidence.partial, true);
});

test('authentication failures stop after one attempt with the permission hint', async (t) => {
  const { repo, env, context } = setup(t, { extraEnv: { FAKE_COPILOT_EXIT: '1', FAKE_COPILOT_STDERR: 'Error: Classic Personal Access Tokens (ghp_) are not supported by Copilot.' } });
  const { base, head } = twoCommits(repo);
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, maxAttempts: 3 }), context, env, log: quiet });
  assert.equal(state.status, 'failed');
  assert.match(state.reason, /copilot-requests: write/);
  assert.ok(!existsSync(join(context.stateDir, 'attempt-2')));
});

test('the deadline covers the whole generation', async (t) => {
  const { repo, env, context } = setup(t, { extraEnv: { FAKE_COPILOT_SLEEP_MS: '20000' } });
  const { base, head } = twoCommits(repo);
  const started = Date.now();
  const state = await generate({ inputs: fakeInputs({ repositoryPath: repo.dir, mode: 'range', base, head, timeoutSeconds: 3 }), context, env, log: quiet });
  assert.equal(state.status, 'failed');
  assert.match(state.reason, /did not finish within/);
  assert.ok(Date.now() - started < 9000);
});

test('a directory that is not a repository fails early', async (t) => {
  const { dir, cleanup } = tempDir();
  t.after(cleanup);
  writeFileSync(join(dir, 'x'), 'x');
  const state = await generate({ inputs: fakeInputs({ repositoryPath: dir, mode: 'range', base: 'a', head: 'b' }), context: fakeContext({ stateDir: join(dir, 'state') }), env: { PATH: process.env.PATH }, log: quiet });
  assert.equal(state.status, 'failed');
  assert.match(state.reason, /not a git work tree/);
});
