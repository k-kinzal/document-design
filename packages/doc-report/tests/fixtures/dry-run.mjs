// Runs the three generation steps locally with the fake Copilot CLI, the
// way the composite action would, and prints where the files ended up.
//
//   node tests/fixtures/dry-run.mjs [--base=REF] [--head=REF] [--language=ja] [--repo=PATH] [--response=valid]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, '../..');
const repoRoot = resolve(packageRoot, '../..');
const flags = Object.fromEntries(process.argv.slice(2).map((a) => { const m = /^--([^=]+)=(.*)$/.exec(a); return m ? [m[1], m[2]] : [a.replace(/^--/, ''), 'true']; }));

const work = mkdtempSync(join(tmpdir(), 'doc-report-dry-'));
const entry = flags.src ? join(packageRoot, 'src/cli.mjs') : join(packageRoot, 'dist/report.mjs');
const env = {
  ...process.env,
  GITHUB_REPOSITORY: flags.repository ?? 'k-kinzal/document-design',
  GITHUB_SERVER_URL: 'https://github.com',
  GITHUB_RUN_ID: '123',
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_OUTPUT: join(work, 'outputs.txt'),
  GITHUB_STEP_SUMMARY: join(work, 'summary.md'),
  DD_REPORT_STATE_DIR: join(work, 'state'),
  DD_REPORT_ACTION_PATH: repoRoot,
  DD_REPORT_COPILOT_BIN: join(here, 'fake-copilot.mjs'),
  FAKE_COPILOT_RESPONSE: flags.response ?? 'valid',
  FAKE_COPILOT_RECORD: join(work, 'record.json'),
  DD_INPUT_GITHUB_TOKEN: 'dry-run-token',
  DD_INPUT_REPOSITORY_PATH: flags.repo ?? repoRoot,
  DD_INPUT_MODE: flags.mode ?? 'range',
  DD_INPUT_BASE: flags.base ?? 'v1.0.0',
  DD_INPUT_HEAD: flags.head ?? 'HEAD',
  DD_INPUT_LANGUAGE: flags.language ?? 'en',
  DD_INPUT_REPORT_ID: flags['report-id'] ?? 'default',
};
const step = (name, extra = {}) => {
  try {
    execFileSync(process.execPath, [entry, name, '--mode=auto', '--report-id=default'], { env: { ...env, ...extra }, stdio: 'inherit' });
    return 0;
  } catch (error) {
    return error.status ?? 1;
  }
};
step('generate');
step('manifest', { DD_ARTIFACT_ID: '999', DD_ARTIFACT_URL: 'https://github.com/k-kinzal/document-design/actions/runs/123/artifacts/999', DD_ARTIFACT_DIGEST: 'sha256:dry' });
const code = step('finish', { DD_MANIFEST_ARTIFACT_ID: '1000', DD_MANIFEST_ARTIFACT_URL: 'https://github.com/k-kinzal/document-design/actions/runs/123/artifacts/1000' });
console.log(`\nfinish exit code: ${code}`);
console.log(`work dir: ${work}`);
console.log('--- outputs ---');
console.log(readFileSync(env.GITHUB_OUTPUT, 'utf8'));
console.log('--- summary ---');
console.log(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8'));
try {
  const record = JSON.parse(readFileSync(env.FAKE_COPILOT_RECORD, 'utf8'));
  console.log('--- fake cli received ---');
  console.log('args:', record.args.filter((a) => a !== record.prompt).join(' '));
  console.log('env keys:', Object.keys(record.env).sort().join(', '));
  console.log('prompt bytes:', Buffer.byteLength(record.prompt), record.promptFile ? `(via ${record.promptFile})` : '(inline)');
} catch {}
