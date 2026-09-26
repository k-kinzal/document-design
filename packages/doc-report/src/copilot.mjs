// The Copilot CLI adapter. The CLI runs in an empty directory of its own,
// with its own home, an explicit environment, no custom instructions, no
// MCP servers, and shell, write and URL tools denied. It is given the prompt
// and asked for text; nothing it could do to the analysed repository is
// reachable from where it runs.
import { execFile, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { COPILOT_CLI_PACKAGE, COPILOT_CLI_VERSION } from './version.mjs';

const run = promisify(execFile);

// Linux limits one argv string to 128 KiB. Prompts below this go inline;
// larger ones are written to a file the CLI reads from its own directory.
export const INLINE_PROMPT_LIMIT = 100000;

export class CopilotError extends Error {
  constructor(message, { kind = 'failed', stderr = '', exitCode = null } = {}) {
    super(message);
    this.name = 'CopilotError';
    this.kind = kind;
    this.stderr = stderr;
    this.exitCode = exitCode;
  }
}

const PASS_ENV = ['PATH', 'HTTP_PROXY', 'HTTPS_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'no_proxy', 'GH_HOST', 'SystemRoot', 'TEMP', 'TMP'];

export function cliEnvironment({ token, home, env = process.env }) {
  const out = { HOME: home, COPILOT_HOME: join(home, 'state'), CI: '1', NO_COLOR: '1', TERM: 'dumb', COPILOT_AUTO_UPDATE: 'false', GITHUB_TOKEN: token, XDG_CACHE_HOME: join(home, 'cache'), XDG_CONFIG_HOME: join(home, 'config'), TMPDIR: join(home, 'tmp') };
  for (const key of PASS_ENV) if (env[key] !== undefined) out[key] = env[key];
  // A stand-in binary (tests, local dry runs) may take its own settings.
  if (env.DD_REPORT_COPILOT_BIN) for (const key of Object.keys(env)) if (key.startsWith('FAKE_COPILOT_')) out[key] = env[key];
  return out;
}

export function cliArguments({ prompt, model, home, promptFile = null }) {
  const args = [
    '-p', promptFile ? `Read the file ${promptFile} in the current directory. It contains your complete instructions and the evidence. Follow it and reply with the JSON object it asks for.` : prompt,
    '-s',
    '--no-custom-instructions',
    '--no-auto-update',
    '--no-color',
    '--no-ask-user',
    '--disable-builtin-mcps',
    '--deny-tool', 'shell',
    '--deny-tool', 'write',
    '--deny-tool', 'url',
    '--log-level', 'error',
    '--log-dir', join(home, 'logs'),
    '--usage-output-file', join(home, 'usage.json'),
  ];
  if (model) args.push('--model', model);
  return args;
}

// Installs the pinned CLI into a private prefix. Returns the platform binary
// or the npm loader when no direct binary is found.
export async function ensureCli({ prefix, env = process.env, log = () => {} }) {
  const explicit = env.DD_REPORT_COPILOT_BIN;
  if (explicit) return { bin: explicit, version: env.DD_REPORT_COPILOT_VERSION || 'external', installed: false };
  const loader = join(prefix, 'node_modules', COPILOT_CLI_PACKAGE, 'npm-loader.js');
  if (!existsSync(loader)) {
    mkdirSync(prefix, { recursive: true });
    log(`Installing ${COPILOT_CLI_PACKAGE}@${COPILOT_CLI_VERSION}`);
    try {
      await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--prefix', prefix, '--no-audit', '--no-fund', '--no-package-lock', '--omit=dev', '--loglevel=error', `${COPILOT_CLI_PACKAGE}@${COPILOT_CLI_VERSION}`], { env, cwd: prefix, maxBuffer: 8 * 1024 * 1024 });
    } catch (error) {
      throw new CopilotError(`Installing ${COPILOT_CLI_PACKAGE}@${COPILOT_CLI_VERSION} failed: ${String(error.stderr || error.message).trim().split('\n').slice(-3).join(' ')}`, { kind: 'install' });
    }
  }
  const platform = process.platform === 'linux' ? ['linuxmusl', 'linux'] : [process.platform];
  for (const p of platform) {
    const bin = join(prefix, 'node_modules', '@github', `copilot-${p}-${process.arch}`, process.platform === 'win32' ? 'copilot.exe' : 'copilot');
    if (existsSync(bin)) return { bin, version: COPILOT_CLI_VERSION, installed: true };
  }
  return { bin: loader, version: COPILOT_CLI_VERSION, installed: true, viaNode: true };
}

export async function runCopilot({ prompt, model, token, workRoot, timeoutMs, cli, env = process.env, log = () => {} }) {
  const home = join(workRoot, 'home');
  const cwd = join(workRoot, 'work');
  for (const dir of [home, cwd, join(home, 'state'), join(home, 'logs'), join(home, 'tmp'), join(home, 'cache'), join(home, 'config')]) mkdirSync(dir, { recursive: true });
  let promptFile = null;
  if (Buffer.byteLength(prompt, 'utf8') > INLINE_PROMPT_LIMIT) {
    promptFile = 'prompt.md';
    writeFileSync(join(cwd, promptFile), prompt);
    log(`Prompt is ${Buffer.byteLength(prompt, 'utf8')} bytes; passing it as a file`);
  }
  const args = cliArguments({ prompt, model, home, promptFile });
  const command = cli.viaNode ? process.execPath : cli.bin;
  const commandArgs = cli.viaNode ? [cli.bin, ...args] : args;
  const started = Date.now();
  const result = await spawnCollect(command, commandArgs, { cwd, env: cliEnvironment({ token, home, env }), timeoutMs });
  const elapsed = Date.now() - started;
  const stderr = redact(result.stderr, token).slice(-8000);
  if (result.timedOut) throw new CopilotError(`Copilot CLI did not finish within ${Math.round(timeoutMs / 1000)}s and was stopped.`, { kind: 'timeout', stderr });
  if (result.code !== 0) {
    const text = `${stderr}\n${redact(result.stdout, token).slice(-2000)}`;
    throw new CopilotError(classify(text, result.code), { kind: kindOf(text), stderr, exitCode: result.code });
  }
  const usage = readUsage(join(home, 'usage.json'));
  return { text: redact(result.stdout, token), usage, elapsedMs: elapsed, stderr };
}

function redact(text, token) {
  let out = String(text ?? '');
  if (token) out = out.split(token).join('[redacted]');
  return out.replace(/gh[pousr]_[A-Za-z0-9]{20,}/g, '[redacted]');
}

function kindOf(text) {
  const t = text.toLowerCase();
  if (/not supported by copilot|authentication|unauthori[sz]ed|401|invalid token|log ?in/.test(t)) return 'auth';
  if (/403|forbidden|policy|not enabled|no access|subscription|seat|copilot-requests/.test(t)) return 'access';
  if (/rate limit|429|quota|exceeded|limit reached|premium request/.test(t)) return 'quota';
  return 'failed';
}

function classify(text, code) {
  const kind = kindOf(text);
  const hint = {
    auth: 'Copilot CLI rejected the token. Pass `github-token: ${{ github.token }}` and give the job `copilot-requests: write`.',
    access: 'Copilot is not available to this token. On a personal repository the owner needs a Copilot seat; in an organization the policy "Allow use of Copilot CLI billed to the organization" must be enabled, and the job needs `copilot-requests: write`.',
    quota: 'Copilot reported a usage or rate limit. Wait, or raise the plan\'s limits; the action does not fall back to another provider.',
    failed: 'Copilot CLI exited with an error.',
  }[kind];
  const last = text.trim().split('\n').filter(Boolean).slice(-3).join(' | ').slice(0, 600);
  return `${hint} (exit ${code}${last ? `: ${last}` : ''})`;
}

function readUsage(file) {
  if (!existsSync(file)) return null;
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    return summariseUsage(data);
  } catch {
    return null;
  }
}

// The usage file's exact shape is the CLI's; only model names and integer
// counters are kept, so the manifest never carries anything surprising.
export function summariseUsage(data) {
  const models = new Set();
  const counters = {};
  const walk = (value, key = '') => {
    if (value && typeof value === 'object') {
      if (!Array.isArray(value)) {
        for (const [k, v] of Object.entries(value)) {
          if ((k === 'model' || k === 'modelId') && typeof v === 'string') models.add(v);
          else if (/^models$|ByModel$|PerModel$/i.test(k) && v && typeof v === 'object' && !Array.isArray(v)) {
            // A map keyed by model name: record the keys, not their contents.
            for (const name of Object.keys(v)) if (/[a-z]/i.test(name) && name.length < 64) models.add(name);
            for (const inner of Object.values(v)) walk(inner, k);
            continue;
          }
          walk(v, k);
        }
      } else for (const v of value) walk(v, key);
    } else if (typeof value === 'number' && Number.isFinite(value) && /token|request|credit|aiu/i.test(key)) {
      counters[key] = (counters[key] ?? 0) + value;
    }
  };
  walk(data);
  return { models: [...models].slice(0, 8), counters: Object.fromEntries(Object.entries(counters).slice(0, 16)) };
}

function spawnCollect(command, args, { cwd, env, timeoutMs }) {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32' });
    } catch (error) {
      reject(new CopilotError(`Cannot start Copilot CLI: ${error.message}`, { kind: 'install' }));
      return;
    }
    const out = [], err = [];
    let outBytes = 0, errBytes = 0;
    let timedOut = false;
    let settled = false;
    const kill = (signal) => {
      try { if (child.pid && process.platform !== 'win32') process.kill(-child.pid, signal); else child.kill(signal); } catch {}
    };
    const timer = setTimeout(() => {
      timedOut = true;
      kill('SIGTERM');
      setTimeout(() => kill('SIGKILL'), 5000).unref();
    }, timeoutMs);
    child.stdout.on('data', (chunk) => { if (outBytes < 16 * 1024 * 1024) { out.push(chunk); outBytes += chunk.length; } });
    child.stderr.on('data', (chunk) => { if (errBytes < 4 * 1024 * 1024) { err.push(chunk); errBytes += chunk.length; } });
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new CopilotError(`Cannot start Copilot CLI: ${error.message}`, { kind: 'install' }));
    });
    child.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code: code ?? (signal ? 128 : 1), signal, timedOut, stdout: Buffer.concat(out).toString('utf8'), stderr: Buffer.concat(err).toString('utf8') });
    });
  });
}
