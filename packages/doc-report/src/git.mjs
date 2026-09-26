// A narrow git wrapper. Every call is execFile with an argument array; refs
// are placed after `--end-of-options`; external diff drivers, textconv and
// pagers are disabled. The repository being analysed is data, never a source
// of configuration or executable hooks.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { EMPTY_TREE } from './version.mjs';

const run = promisify(execFile);

const SAFE_ENV_KEYS = ['PATH', 'HOME', 'TMPDIR', 'TEMP', 'TMP', 'SystemRoot', 'USERPROFILE'];

export class GitError extends Error {
  constructor(args, code, stderr) {
    super(`git ${args.slice(0, 3).join(' ')} failed (${code}): ${stderr.trim().split('\n')[0] || 'no output'}`);
    this.name = 'GitError';
    this.code = code;
    this.stderr = stderr;
  }
}

export function createGit(cwd, { env = process.env, maxBuffer = 64 * 1024 * 1024 } = {}) {
  const safeEnv = { GIT_TERMINAL_PROMPT: '0', GIT_CONFIG_NOSYSTEM: '1', LC_ALL: 'C', GIT_PAGER: 'cat', GIT_EXTERNAL_DIFF: '' };
  for (const key of SAFE_ENV_KEYS) if (env[key] !== undefined) safeEnv[key] = env[key];

  async function git(args, { allowFailure = false, buffer = false } = {}) {
    const full = ['-c', 'core.pager=cat', '-c', 'core.quotePath=false', '-c', 'diff.noprefix=false', ...args];
    try {
      const result = await run('git', full, { cwd, env: safeEnv, maxBuffer, encoding: buffer ? 'buffer' : 'utf8' });
      return { code: 0, stdout: result.stdout, stderr: result.stderr };
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error('git is not installed or not on PATH');
      if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') throw Object.assign(new Error('git output exceeded the buffer'), { code: 'MAXBUFFER' });
      const code = typeof error.code === 'number' ? error.code : 1;
      if (allowFailure) return { code, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
      throw new GitError(args, code, String(error.stderr ?? error.message));
    }
  }

  return {
    cwd,
    async toplevel() {
      const { stdout } = await git(['rev-parse', '--show-toplevel']);
      return stdout.trim();
    },
    async version() {
      const { stdout } = await git(['--version']);
      return stdout.trim().replace(/^git version\s*/, '');
    },
    // A ref becomes a commit SHA or null. Tags are peeled to the commit.
    async resolveCommit(ref) {
      const { code, stdout } = await git(['rev-parse', '--verify', '--quiet', '--end-of-options', `${ref}^{commit}`], { allowFailure: true });
      return code === 0 ? stdout.trim() : null;
    },
    async commitExists(sha) {
      const { code } = await git(['cat-file', '-e', `${sha}^{commit}`], { allowFailure: true });
      return code === 0;
    },
    async treeOf(sha) {
      const { stdout } = await git(['rev-parse', '--verify', '--end-of-options', `${sha}^{tree}`]);
      return stdout.trim();
    },
    async mergeBases(a, b) {
      const { code, stdout } = await git(['merge-base', '--all', '--end-of-options', a, b], { allowFailure: true });
      return code === 0 ? stdout.trim().split('\n').filter(Boolean) : [];
    },
    async isAncestor(a, b) {
      const { code } = await git(['merge-base', '--is-ancestor', '--end-of-options', a, b], { allowFailure: true });
      return code === 0;
    },
    // Tags with their peeled commit. Lightweight tags have no `*objectname`.
    async tags() {
      const format = '%(refname:strip=2)%00%(objecttype)%00%(objectname)%00%(*objectname)';
      const { stdout } = await git(['for-each-ref', `--format=${format}`, 'refs/tags']);
      return stdout.split('\n').filter(Boolean).map((line) => {
        const [name, type, object, peeled] = line.split('\0');
        return { name, type, commit: type === 'tag' ? peeled || null : object, annotated: type === 'tag' };
      });
    },
    async changedFiles(base, head) {
      const from = base ?? EMPTY_TREE;
      const status = await git(['diff', '--no-ext-diff', '--no-textconv', '--no-color', '-M', '--name-status', '-z', '--end-of-options', from, head]);
      const numstat = await git(['diff', '--no-ext-diff', '--no-textconv', '--no-color', '-M', '--numstat', '-z', '--end-of-options', from, head]);
      return parseChangedFiles(status.stdout, numstat.stdout);
    },
    async fileDiff(base, head, paths) {
      const from = base ?? EMPTY_TREE;
      try {
        const { stdout } = await git(['diff', '--no-ext-diff', '--no-textconv', '--no-color', '-M', '--unified=3', '--end-of-options', from, head, '--', ...paths]);
        return stdout;
      } catch (error) {
        if (error.code === 'MAXBUFFER') return null;
        throw error;
      }
    },
    async commits(base, head, limit) {
      const format = '%H%x00%h%x00%an%x00%aI%x00%s%x00%b%x1e';
      const range = base ? [`${base}..${head}`] : [head];
      const { stdout } = await git(['log', `--format=${format}`, `--max-count=${limit + 1}`, '--end-of-options', ...range]);
      const records = stdout.split('\x1e').map((r) => r.replace(/^\n/, '')).filter((r) => r.trim());
      const commits = records.map((record) => {
        const [sha, short, author, date, subject, body = ''] = record.split('\0');
        return { sha, short, author, date, subject: subject.trim(), body: body.trim() };
      });
      return { commits: commits.slice(0, limit), truncated: commits.length > limit };
    },
    async commitCount(base, head) {
      const range = base ? [`${base}..${head}`] : [head];
      const { stdout } = await git(['rev-list', '--count', '--end-of-options', ...range]);
      return Number(stdout.trim());
    },
  };
}

export function parseChangedFiles(statusOutput, numstatOutput) {
  const files = [];
  const status = statusOutput.split('\0');
  for (let i = 0; i < status.length; ) {
    const code = status[i++];
    if (!code) continue;
    const letter = code[0];
    if (letter === 'R' || letter === 'C') {
      const oldPath = status[i++];
      const path = status[i++];
      files.push({ path, oldPath, status: letter, similarity: Number(code.slice(1)) || null });
    } else {
      const path = status[i++];
      files.push({ path, oldPath: null, status: letter, similarity: null });
    }
  }
  const byPath = new Map(files.map((f) => [f.path, f]));
  const numstat = numstatOutput.split('\0');
  for (let i = 0; i < numstat.length; ) {
    const entry = numstat[i++];
    if (!entry) continue;
    const [added, deleted, inline] = entry.split('\t');
    let path = inline;
    if (inline === '' || inline === undefined) {
      // Rename: `added\tdeleted\t\0old\0new`
      i++; // old path
      path = numstat[i++];
    }
    const file = byPath.get(path);
    if (!file) continue;
    file.binary = added === '-' || deleted === '-';
    file.added = file.binary ? null : Number(added);
    file.deleted = file.binary ? null : Number(deleted);
  }
  for (const file of files) {
    if (file.binary === undefined) { file.binary = false; file.added = 0; file.deleted = 0; }
  }
  return files;
}
