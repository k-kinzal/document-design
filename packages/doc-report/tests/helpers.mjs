// Test helpers: throwaway git repositories, a fake GitHub API client, and
// the environment the fake Copilot CLI needs.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GitHubError } from '../src/github.mjs';

export const here = dirname(fileURLToPath(import.meta.url));
export const packageRoot = resolve(here, '..');
export const repoRoot = resolve(packageRoot, '../..');
export const fakeCopilot = join(here, 'fixtures/fake-copilot.mjs');

export function tempDir(prefix = 'doc-report-test-') {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

const GIT_ENV = { ...process.env, GIT_AUTHOR_NAME: 'Test Author', GIT_AUTHOR_EMAIL: 'test@example.invalid', GIT_COMMITTER_NAME: 'Test Author', GIT_COMMITTER_EMAIL: 'test@example.invalid', GIT_AUTHOR_DATE: '2026-01-02T03:04:05Z', GIT_COMMITTER_DATE: '2026-01-02T03:04:05Z', GIT_CONFIG_NOSYSTEM: '1', HOME: tmpdir() };

// A tiny imperative git: repo.commit({ 'a.txt': 'text' }, 'message').
export function makeRepo(prefix = 'doc-report-repo-') {
  const { dir, cleanup } = tempDir(prefix);
  const git = (...args) => execFileSync('git', args, { cwd: dir, env: GIT_ENV, encoding: 'utf8' }).trim();
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'Test Author');
  git('config', 'user.email', 'test@example.invalid');
  let tick = 0;
  const repo = {
    dir, git, cleanup,
    write(files) {
      for (const [path, content] of Object.entries(files)) {
        const full = join(dir, path);
        mkdirSync(dirname(full), { recursive: true });
        if (content === null) rmSync(full, { force: true });
        else writeFileSync(full, content);
      }
    },
    commit(files, message = 'change', { body = '' } = {}) {
      repo.write(files);
      git('add', '-A');
      tick++;
      const date = `2026-01-02T03:${String(tick).padStart(2, '0')}:00Z`;
      execFileSync('git', ['commit', '-q', '--allow-empty', '-m', body ? `${message}\n\n${body}` : message], { cwd: dir, env: { ...GIT_ENV, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date }, encoding: 'utf8' });
      return git('rev-parse', 'HEAD');
    },
    tag(name, { annotated = false, message = name } = {}) {
      if (annotated) git('tag', '-a', name, '-m', message);
      else git('tag', name);
      return git('rev-list', '-n', '1', name);
    },
    branch(name, from = 'HEAD') { git('checkout', '-q', '-b', name, from); },
    checkout(ref) { git('checkout', '-q', ref); },
    merge(ref) { git('merge', '-q', '--no-edit', '--no-ff', ref); return git('rev-parse', 'HEAD'); },
    head() { return git('rev-parse', 'HEAD'); },
  };
  return repo;
}

// A fake GitHub REST client: routes are `METHOD /path` → handler(body, url).
export function fakeClient(routes, { log = [] } = {}) {
  const lookup = (method, path) => {
    const url = new URL(path, 'https://api.github.com');
    const key = `${method} ${url.pathname}`;
    for (const [pattern, handler] of Object.entries(routes)) {
      const [m, p] = pattern.split(' ');
      if (m !== method) continue;
      if (p === url.pathname) return { handler, url };
      if (p.endsWith('*') && url.pathname.startsWith(p.slice(0, -1))) return { handler, url };
    }
    throw Object.assign(new Error(`no fake route for ${key}`), { status: 404, name: 'GitHubError' });
  };
  return {
    log,
    apiUrl: 'https://api.github.com',
    async request(method, path, options = {}) {
      log.push({ method, path, body: options.body });
      const { handler, url } = lookup(method, path);
      const result = typeof handler === 'function' ? await handler(options.body, url, options) : handler;
      if (result instanceof Error) throw result;
      return result;
    },
    async paginate(path, { limit = Infinity } = {}) {
      log.push({ method: 'GET', path, paginate: true });
      const { handler, url } = lookup('GET', path);
      const result = typeof handler === 'function' ? await handler(undefined, url, {}) : handler;
      if (result instanceof Error) throw result;
      return (Array.isArray(result) ? result : []).slice(0, limit);
    },
  };
}

export function apiError(status, message) {
  return new GitHubError(status, message, { method: 'FAKE', path: '' });
}

// Context as the action would see it inside a run.
export function fakeContext(overrides = {}) {
  return {
    repository: 'octo/consumer', serverUrl: 'https://github.com', apiUrl: 'https://api.github.com',
    eventName: 'push', event: null, ref: 'refs/heads/main', sha: '', runId: '4242', runAttempt: '1', workflow: 'Report', job: 'report',
    actionRef: 'report-v1', actionRepository: 'k-kinzal/document-design', actionPath: '', runnerTemp: '', stateDir: '', outputFile: '', summaryFile: '',
    ...overrides,
  };
}

export function fakeInputs(overrides = {}) {
  return {
    token: 'ghs_testtoken1234567890abcdefghijklmnop', repositoryPath: '.', mode: 'range', base: null, head: null, prNumber: null, language: 'en', title: null, instructions: null, model: 'auto', reportId: 'default',
    retentionDays: 30, timeoutSeconds: 60, maxInputBytes: 200000, maxAttempts: 2, onEmpty: 'report', baseStrategy: 'previous-stable', initialRelease: 'full',
    ...overrides,
  };
}

export const quiet = () => {};
