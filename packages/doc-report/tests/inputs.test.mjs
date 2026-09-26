import test from 'node:test';
import assert from 'node:assert/strict';
import { InputError, parseGenerateInputs, parsePublishInputs, readEnv } from '../src/inputs.mjs';

const base = { 'github-token': 'ghs_x', 'repository-path': '.' };

test('defaults are applied and documented values are accepted', () => {
  const inputs = parseGenerateInputs({ ...base, base: 'v1.0.0', head: 'v1.1.0', mode: 'range', language: 'ja', 'report-id': 'release_1' });
  assert.equal(inputs.mode, 'range');
  assert.equal(inputs.language, 'ja');
  assert.equal(inputs.retentionDays, 30);
  assert.equal(inputs.timeoutSeconds, 600);
  assert.equal(inputs.maxInputBytes, 200000);
  assert.equal(inputs.maxAttempts, 2);
  assert.equal(inputs.onEmpty, 'report');
  assert.equal(inputs.model, 'auto');
  assert.equal(inputs.reportId, 'release_1');
  assert.equal(inputs.title, null);
});

test('empty strings mean unset', () => {
  const inputs = parseGenerateInputs({ ...base, base: '', head: '  ', 'pr-number': '', title: '', model: '' });
  assert.equal(inputs.base, null);
  assert.equal(inputs.head, null);
  assert.equal(inputs.prNumber, null);
  assert.equal(inputs.model, 'auto');
});

for (const [name, value, why] of [
  ['mode', 'guess', 'unknown enum'],
  ['language', 'fr', 'unsupported language'],
  ['on-empty', 'ignore', 'unknown enum'],
  ['retention-days', '0', 'below range'],
  ['retention-days', '91', 'above range'],
  ['retention-days', '-5', 'negative'],
  ['timeout-seconds', '1', 'too small'],
  ['max-input-bytes', 'lots', 'not a number'],
  ['max-attempts', '0', 'zero attempts'],
  ['report-id', '../etc', 'path characters'],
  ['report-id', 'a b', 'space'],
  ['report-id', 'x'.repeat(41), 'too long'],
  ['base', '--upload-pack=evil', 'flag-like ref'],
  ['base', 'a..b', 'range syntax'],
  ['head', 'refs/heads/ma\u0007in', 'control character'],
  ['head', 'feature@{1}', 'reflog syntax'],
  ['model', 'gpt 5', 'space in model'],
  ['pr-number', '12abc', 'not a number'],
]) {
  test(`rejects ${name}=${JSON.stringify(value)} (${why})`, () => {
    assert.throws(() => parseGenerateInputs({ ...base, [name]: value }), (error) => error instanceof InputError && error.input === name);
  });
}

test('a token is required', () => {
  assert.throws(() => parseGenerateInputs({ 'repository-path': '.' }), /github-token/);
});

test('repository-path must be a directory', () => {
  assert.throws(() => parseGenerateInputs({ ...base, 'repository-path': 'does/not/exist' }), /not a directory/);
});

test('publish inputs validate the target and release tag', () => {
  assert.throws(() => parsePublishInputs({ 'github-token': 't', target: 'gist', 'source-run-id': '1' }), /target/);
  assert.throws(() => parsePublishInputs({ 'github-token': 't', target: 'release', 'source-run-id': '1' }), /release-tag/);
  assert.throws(() => parsePublishInputs({ 'github-token': 't', target: 'pr', 'source-run-id': '1', 'create-draft': 'yes' }), /create-draft/);
  const inputs = parsePublishInputs({ 'github-token': 't', target: 'release', 'source-run-id': '99', 'release-tag': 'v1.2.3', 'create-draft': 'true' });
  assert.equal(inputs.sourceRunId, 99);
  assert.equal(inputs.createDraft, true);
  assert.equal(inputs.updateReleaseBody, true);
  assert.equal(inputs.replaceAssets, false);
  assert.equal(inputs.commentAuthor, 'github-actions[bot]');
});

test('environment names map to inputs', () => {
  const raw = readEnv({ DD_INPUT_GITHUB_TOKEN: 't', DD_INPUT_REPORT_ID: 'main', DD_INPUT_MAX_INPUT_BYTES: '50000' });
  assert.equal(raw['github-token'], 't');
  assert.equal(raw['report-id'], 'main');
  assert.equal(raw['max-input-bytes'], '50000');
});
