// A consumer that is not document-design: a repository with a couple of
// commits, and only the files a `uses:` checkout of the action would
// contain — no node_modules, no doc-ui build, no repository git metadata.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fakeCopilot, makeRepo, repoRoot, tempDir } from './helpers.mjs';

function actionCheckout(dir) {
  const action = join(dir, 'action');
  mkdirSync(action, { recursive: true });
  for (const file of ['action.yml', 'actions/release/action.yml', 'actions/publish/action.yml', 'LICENSE']) {
    mkdirSync(join(action, file, '..'), { recursive: true });
    cpSync(join(repoRoot, file), join(action, file));
  }
  cpSync(join(repoRoot, 'packages/doc-report/dist'), join(action, 'packages/doc-report/dist'), { recursive: true });
  assert.ok(!existsSync(join(action, 'packages/doc-report/src')), 'the consumer sees only dist');
  return action;
}

function runStep(entry, command, args, env) {
  return execFileSync(process.execPath, [entry, command, ...args], { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function outputs(file) {
  return Object.fromEntries(readFileSync(file, 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => l.split(/=(.*)/s).slice(0, 2)));
}

test('the root action generates a push report for a foreign repository from a bare action checkout', async (t) => {
  const { dir, cleanup } = tempDir();
  const repo = makeRepo();
  t.after(() => { cleanup(); repo.cleanup(); });
  const action = actionCheckout(dir);
  const before = repo.commit({ 'lib/thing.rb': "puts 'a'\n" }, 'start');
  repo.commit({ 'lib/thing.rb': "puts 'b'\n" }, 'middle');
  const after = repo.commit({ 'lib/other.rb': "puts 'c'\n" }, 'end');
  const eventPath = join(dir, 'event.json');
  writeFileSync(eventPath, JSON.stringify({ before, after, forced: false }));
  const env = {
    PATH: process.env.PATH, HOME: process.env.HOME,
    GITHUB_REPOSITORY: 'someone/ruby-thing', GITHUB_EVENT_NAME: 'push', GITHUB_EVENT_PATH: eventPath, GITHUB_REF: 'refs/heads/main', GITHUB_SHA: after,
    GITHUB_RUN_ID: '77', GITHUB_RUN_ATTEMPT: '2', GITHUB_ACTION_REF: 'report-v1', GITHUB_ACTION_REPOSITORY: 'k-kinzal/document-design',
    GITHUB_OUTPUT: join(dir, 'out.txt'), GITHUB_STEP_SUMMARY: join(dir, 'summary.md'),
    DD_REPORT_ACTION_PATH: action, DD_REPORT_STATE_DIR: join(dir, 'state'),
    DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_RESPONSE: 'valid',
    DD_INPUT_GITHUB_TOKEN: 'ghs_consumer', DD_INPUT_REPOSITORY_PATH: repo.dir, DD_INPUT_MODE: 'auto', DD_INPUT_LANGUAGE: 'en', DD_INPUT_REPORT_ID: 'default',
  };
  const entry = join(action, 'packages/doc-report/dist/report.mjs');
  runStep(entry, 'generate', ['--mode=auto', '--report-id=default'], env);
  let out = outputs(env.GITHUB_OUTPUT);
  assert.equal(out.upload, 'true');
  assert.match(out['report-path'], new RegExp(`document-design-default-${after.slice(0, 7)}-77-2\\.html$`));
  runStep(entry, 'manifest', [], { ...env, DD_ARTIFACT_ID: '5', DD_ARTIFACT_URL: 'https://github.com/someone/ruby-thing/actions/runs/77/artifacts/5', DD_ARTIFACT_DIGEST: 'sha256:x' });
  runStep(entry, 'finish', [], { ...env, DD_MANIFEST_ARTIFACT_ID: '6', DD_MANIFEST_ARTIFACT_URL: 'https://github.com/someone/ruby-thing/actions/runs/77/artifacts/6' });
  out = outputs(env.GITHUB_OUTPUT);
  assert.equal(out.status, 'complete');
  assert.equal(out['has-changes'], 'true');
  assert.equal(out['base-sha'], before);
  assert.equal(out['head-sha'], after);
  assert.equal(out['artifact-id'], '5');
  assert.equal(out['manifest-artifact-id'], '6');
  assert.equal(out['run-url'], 'https://github.com/someone/ruby-thing/actions/runs/77/attempts/2');
  const manifest = JSON.parse(readFileSync(out['manifest-path'], 'utf8'));
  assert.equal(manifest.artifact.id, 5);
  assert.equal(manifest.generator.revision, 'report-v1', 'no git metadata in the action checkout, so the ref is recorded');
  assert.equal(manifest.evidence.commits, 2);
  const summary = readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8');
  assert.match(summary, /View HTML report\*\*: https:\/\/github\.com\/someone\/ruby-thing\/actions\/runs\/77\/artifacts\/5/);
  assert.match(summary, /Retention: 30 days/);
  const html = readFileSync(out['report-path'], 'utf8');
  assert.ok(html.includes('https://github.com/someone/ruby-thing/blob/'));
  assert.ok(!html.includes('ghs_consumer'));
});

test('the release action resolves the previous stable tag of a foreign repository', async (t) => {
  const { dir, cleanup } = tempDir();
  const repo = makeRepo();
  t.after(() => { cleanup(); repo.cleanup(); });
  const action = actionCheckout(dir);
  repo.commit({ 'a.txt': '1\n' }, 'one');
  repo.tag('v0.9.0');
  repo.commit({ 'a.txt': '2\n' }, 'two');
  repo.tag('v0.10.0', { annotated: true });
  repo.tag('report-v1');
  const head = repo.commit({ 'a.txt': '3\n' }, 'three');
  repo.tag('v1.0.0', { annotated: true });
  const env = {
    PATH: process.env.PATH, HOME: process.env.HOME,
    GITHUB_REPOSITORY: 'someone/thing', GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/tags/v1.0.0', GITHUB_SHA: head,
    GITHUB_RUN_ID: '78', GITHUB_RUN_ATTEMPT: '1', GITHUB_OUTPUT: join(dir, 'out.txt'), GITHUB_STEP_SUMMARY: join(dir, 'summary.md'),
    DD_REPORT_ACTION_PATH: action, DD_REPORT_STATE_DIR: join(dir, 'state'),
    DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_RESPONSE: 'valid',
    DD_INPUT_GITHUB_TOKEN: 'ghs_consumer', DD_INPUT_REPOSITORY_PATH: repo.dir, DD_INPUT_LANGUAGE: 'ja',
  };
  const entry = join(action, 'packages/doc-report/dist/report.mjs');
  runStep(entry, 'generate', ['--mode=release', '--report-id=release'], env);
  runStep(entry, 'manifest', [], { ...env, DD_ARTIFACT_ID: '9', DD_ARTIFACT_URL: 'https://github.com/someone/thing/actions/runs/78/artifacts/9', DD_ARTIFACT_DIGEST: 'sha256:y' });
  runStep(entry, 'finish', [], { ...env, DD_MANIFEST_ARTIFACT_ID: '10', DD_MANIFEST_ARTIFACT_URL: 'https://x' });
  const out = outputs(env.GITHUB_OUTPUT);
  assert.equal(out.status, 'complete');
  assert.equal(out['base-ref'], 'v0.10.0');
  assert.equal(out['head-ref'], 'v1.0.0');
  assert.equal(out['head-sha'], head);
  assert.match(out['report-path'], /document-design-release-/);
  const manifest = JSON.parse(readFileSync(out['manifest-path'], 'utf8'));
  assert.equal(manifest.rule, 'release-previous-stable');
  assert.equal(manifest.release.tag, 'v1.0.0');
  assert.match(readFileSync(out['report-path'], 'utf8'), /<html lang="ja">/);
});

test('a failed generation records outputs, a summary and a non-zero finish', async (t) => {
  const { dir, cleanup } = tempDir();
  const repo = makeRepo();
  t.after(() => { cleanup(); repo.cleanup(); });
  const action = actionCheckout(dir);
  const base = repo.commit({ 'a.txt': '1\n' }, 'one');
  const head = repo.commit({ 'a.txt': '2\n' }, 'two');
  const env = {
    PATH: process.env.PATH, HOME: process.env.HOME, GITHUB_REPOSITORY: 'someone/thing', GITHUB_RUN_ID: '79', GITHUB_RUN_ATTEMPT: '1',
    GITHUB_OUTPUT: join(dir, 'out.txt'), GITHUB_STEP_SUMMARY: join(dir, 'summary.md'), DD_REPORT_ACTION_PATH: action, DD_REPORT_STATE_DIR: join(dir, 'state'),
    DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_RESPONSE: 'garbage', DD_INPUT_GITHUB_TOKEN: 'ghs_consumer', DD_INPUT_REPOSITORY_PATH: repo.dir, DD_INPUT_MODE: 'range', DD_INPUT_BASE: base, DD_INPUT_HEAD: head, DD_INPUT_MAX_ATTEMPTS: '1',
  };
  const entry = join(action, 'packages/doc-report/dist/report.mjs');
  runStep(entry, 'generate', ['--mode=auto', '--report-id=default'], env);
  assert.equal(outputs(env.GITHUB_OUTPUT).upload, 'false');
  let code = 0;
  try { runStep(entry, 'finish', [], env); } catch (error) { code = error.status; }
  assert.equal(code, 1);
  const out = outputs(env.GITHUB_OUTPUT);
  assert.equal(out.status, 'failed');
  assert.equal(out['artifact-url'], '');
  assert.match(out.reason, /did not return a valid report/);
  assert.match(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8'), /\*\*Failed\*\*/);
});
