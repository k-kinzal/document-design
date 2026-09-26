import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { CopilotError, INLINE_PROMPT_LIMIT, cliArguments, cliEnvironment, ensureCli, runCopilot, summariseUsage } from '../src/copilot.mjs';
import { fakeCopilot, quiet, tempDir } from './helpers.mjs';

const cli = { bin: fakeCopilot, version: 'fake', installed: false };
const token = 'ghs_secretsecretsecretsecretsecret';

test('the CLI is invoked non-interactively with instructions, MCP servers and shell/write/url tools off', () => {
  const args = cliArguments({ prompt: 'p', model: 'auto', home: '/h' });
  for (const flag of ['-p', '-s', '--no-custom-instructions', '--no-auto-update', '--no-color', '--no-ask-user', '--disable-builtin-mcps', '--usage-output-file']) assert.ok(args.includes(flag), flag);
  const denied = args.map((a, i) => (args[i - 1] === '--deny-tool' ? a : null)).filter(Boolean);
  assert.deepEqual(denied, ['shell', 'write', 'url']);
  assert.ok(!args.includes('--allow-all-tools'));
  assert.ok(!args.includes('--yolo'));
  assert.equal(args[args.indexOf('--model') + 1], 'auto');
});

test('the environment is an allowlist: the token, a private home, and nothing from the runner', () => {
  const env = cliEnvironment({ token, home: '/tmp/h', env: { PATH: '/bin', GITHUB_TOKEN: 'other', ACTIONS_RUNTIME_TOKEN: 'secret', ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'secret', AWS_SECRET_ACCESS_KEY: 'secret', HOME: '/home/runner', HTTPS_PROXY: 'https://proxy', FAKE_COPILOT_RESPONSE: 'x' } });
  assert.equal(env.GITHUB_TOKEN, token);
  assert.equal(env.HOME, '/tmp/h');
  assert.equal(env.COPILOT_HOME, join('/tmp/h', 'state'));
  assert.equal(env.PATH, '/bin');
  assert.equal(env.HTTPS_PROXY, 'https://proxy');
  assert.equal(env.COPILOT_AUTO_UPDATE, 'false');
  for (const key of ['ACTIONS_RUNTIME_TOKEN', 'ACTIONS_ID_TOKEN_REQUEST_TOKEN', 'AWS_SECRET_ACCESS_KEY', 'FAKE_COPILOT_RESPONSE']) assert.equal(env[key], undefined, key);
  const testing = cliEnvironment({ token, home: '/tmp/h', env: { DD_REPORT_COPILOT_BIN: '/x', FAKE_COPILOT_RESPONSE: 'y' } });
  assert.equal(testing.FAKE_COPILOT_RESPONSE, 'y');
});

test('an external binary is used as given; nothing is installed', async () => {
  const found = await ensureCli({ prefix: '/nonexistent', env: { DD_REPORT_COPILOT_BIN: fakeCopilot }, log: quiet });
  assert.equal(found.bin, fakeCopilot);
  assert.equal(found.installed, false);
});

test('small prompts go inline; large prompts go through a file in the private working directory', async (t) => {
  const { dir, cleanup } = tempDir();
  t.after(cleanup);
  const record = join(dir, 'record.json');
  const env = { PATH: process.env.PATH, DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_RECORD: record };
  const small = await runCopilot({ prompt: 'hello', model: 'auto', token, workRoot: join(dir, 'a'), timeoutMs: 20000, cli, env, log: quiet });
  assert.match(small.text, /"title"/);
  let got = JSON.parse(readFileSync(record, 'utf8'));
  assert.equal(got.prompt, 'hello');
  assert.equal(got.promptFile, null);
  assert.equal(realpathSync(got.cwd), realpathSync(join(dir, 'a', 'work')));
  assert.equal(got.env.GITHUB_TOKEN, token);
  assert.equal(realpathSync(got.env.HOME), realpathSync(join(dir, 'a', 'home')));
  const big = 'x'.repeat(INLINE_PROMPT_LIMIT + 10);
  await runCopilot({ prompt: big, model: 'auto', token, workRoot: join(dir, 'b'), timeoutMs: 20000, cli, env, log: quiet });
  got = JSON.parse(readFileSync(record, 'utf8'));
  assert.equal(got.promptFile, 'prompt.md');
  assert.equal(got.prompt, big);
  assert.deepEqual(small.usage.models, ['fake-model-1']);
});

test('a hung CLI is stopped at the deadline', async (t) => {
  const { dir, cleanup } = tempDir();
  t.after(cleanup);
  const env = { PATH: process.env.PATH, DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_SLEEP_MS: '20000' };
  const started = Date.now();
  await assert.rejects(runCopilot({ prompt: 'p', model: 'auto', token, workRoot: dir, timeoutMs: 1500, cli, env, log: quiet }), (e) => e instanceof CopilotError && e.kind === 'timeout');
  assert.ok(Date.now() - started < 10000);
});

test('exit codes are classified and the token is redacted from diagnostics', async (t) => {
  const { dir, cleanup } = tempDir();
  t.after(cleanup);
  const run = (stderr, exit) => runCopilot({ prompt: 'p', model: 'auto', token, workRoot: join(dir, String(Math.random())), timeoutMs: 20000, cli, env: { PATH: process.env.PATH, DD_REPORT_COPILOT_BIN: fakeCopilot, FAKE_COPILOT_STDERR: stderr, FAKE_COPILOT_EXIT: String(exit) }, log: quiet });
  await assert.rejects(run(`Error: Classic Personal Access Tokens (ghp_) are not supported by Copilot. token ${token}`, 1), (e) => e.kind === 'auth' && !e.message.includes(token) && !e.stderr.includes(token) && /copilot-requests: write/.test(e.message));
  await assert.rejects(run('Error: Copilot is not enabled for this organization policy', 1), (e) => e.kind === 'access');
  await assert.rejects(run('429 rate limit exceeded', 1), (e) => e.kind === 'quota');
  await assert.rejects(run('boom', 3), (e) => e.kind === 'failed' && e.exitCode === 3);
});

test('usage files are reduced to model names and counters', () => {
  const usage = summariseUsage({ models: { 'claude-x': { requests: 2, usage: { inputTokens: 10, outputTokens: 5 } }, 'gpt-y': { requests: 1 } }, totalPremiumRequests: 3, secret: 'nope' });
  assert.deepEqual(usage.models.sort(), ['claude-x', 'gpt-y']);
  assert.equal(usage.counters.requests, 3);
  assert.equal(usage.counters.inputTokens, 10);
  assert.equal(usage.counters.totalPremiumRequests, 3);
  assert.equal(usage.counters.secret, undefined);
});
