// Evidence: what the model is allowed to know. Collected by trusted code
// before any model runs, sized to a byte budget, and never cut in the
// middle of a UTF-8 sequence — only whole hunks and whole records are
// dropped, and every omission is counted and given a reason.
import { createHash } from 'node:crypto';

export const LIMITS = {
  commits: 200,
  files: 2000,
  commitBody: 1000,
  perFileMin: 6000,
  perFileMax: 60000,
  discussionBody: 8000,
  comments: 20,
  commentBody: 2000,
  issues: 5,
};

const LOCKFILES = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', 'bun.lock', 'composer.lock', 'Cargo.lock', 'Gemfile.lock', 'poetry.lock', 'Pipfile.lock', 'go.sum', 'flake.lock', 'mix.lock', 'packages.lock.json', 'pubspec.lock']);
const GENERATED_DIRS = ['node_modules/', 'dist/', 'build/', 'out/', '.generated/', 'storybook-static/', 'coverage/', 'vendor/', '__snapshots__/'];
const MINIFIED = /\.(min\.(js|css|mjs)|map|bundle\.js|snap)$/;

export function classify(file) {
  const name = file.path.split('/').pop();
  if (file.binary) return 'binary';
  if (LOCKFILES.has(name)) return 'lockfile';
  if (GENERATED_DIRS.some((dir) => file.path.startsWith(dir) || file.path.includes(`/${dir}`))) return 'generated';
  if (MINIFIED.test(name)) return 'generated';
  return 'text';
}

const bytes = (s) => Buffer.byteLength(s, 'utf8');

// A unified diff for one file, split into its header and hunks.
export function splitDiff(diff) {
  const lines = diff.split('\n');
  const header = [];
  const hunks = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('@@')) {
      current = [line];
      hunks.push(current);
    } else if (current) {
      current.push(line);
    } else {
      header.push(line);
    }
  }
  return { header: header.join('\n'), hunks: hunks.map((h) => h.join('\n')) };
}

function truncateText(text, max) {
  if (bytes(text) <= max) return { text, truncated: false };
  // Cut on a line boundary, then on a code point boundary.
  let out = '';
  for (const line of text.split('\n')) {
    if (bytes(out) + bytes(line) + 1 > max) break;
    out += (out ? '\n' : '') + line;
  }
  if (!out) out = Array.from(text).reduce((acc, ch) => (bytes(acc) + bytes(ch) <= max ? acc + ch : acc), '');
  return { text: out, truncated: true };
}

export async function collectEvidence({ git, revision, budget, github = null, context = null, log = () => {} }) {
  const omissions = [];
  const baseSha = revision.base.sha;
  const headSha = revision.head.sha;

  const allFiles = await git.changedFiles(baseSha, headSha);
  const filesTotal = allFiles.length;
  const files = allFiles.slice(0, LIMITS.files);
  if (filesTotal > LIMITS.files) omissions.push({ kind: 'files-truncated', count: filesTotal - LIMITS.files, reason: `Only the first ${LIMITS.files} changed files are listed.` });

  const commitLog = await git.commits(baseSha, headSha, LIMITS.commits);
  const commitsTotal = commitLog.truncated ? await git.commitCount(baseSha, headSha) : commitLog.commits.length;
  const commits = commitLog.commits.map((c) => {
    const body = truncateText(c.body, LIMITS.commitBody);
    return { sha: c.sha, short: c.short, author: c.author, date: c.date, subject: c.subject.slice(0, 300), body: body.text, bodyTruncated: body.truncated };
  });
  if (commitLog.truncated) omissions.push({ kind: 'commits-truncated', count: commitsTotal - commits.length, reason: `Only the first ${LIMITS.commits} of ${commitsTotal} commits are listed.` });

  for (const file of files) {
    file.category = classify(file);
    file.diff = null;
    file.hunksTotal = null;
    file.hunksIncluded = 0;
    file.omitted = null;
  }

  let discussion = null;
  if (revision.pr && github && context?.repository) {
    discussion = await collectDiscussion({ github, repository: context.repository, number: revision.pr.number, omissions, log });
  }

  // The budget covers everything the model reads. Metadata is charged first;
  // diffs share what is left, each text file getting a fair share that it
  // returns to the pool when it does not need it.
  const metadataCost = bytes(JSON.stringify({ commits, files: files.map(({ path, oldPath, status, added, deleted, category }) => ({ path, oldPath, status, added, deleted, category })), discussion }));
  let remaining = Math.max(0, budget - metadataCost);
  const textFiles = files.filter((f) => f.category === 'text');
  const skipped = { binary: 0, lockfile: 0, generated: 0 };
  for (const file of files) if (file.category !== 'text') { skipped[file.category]++; file.omitted = file.category; }
  if (skipped.binary) omissions.push({ kind: 'binary', count: skipped.binary, reason: 'Binary files are listed by name; their contents are not read.' });
  if (skipped.lockfile) omissions.push({ kind: 'lockfile', count: skipped.lockfile, reason: 'Lockfiles are listed by name; their diffs are not read.' });
  if (skipped.generated) omissions.push({ kind: 'generated', count: skipped.generated, reason: 'Generated or minified outputs are listed by name; their diffs are not read.' });

  let budgetOmitted = 0;
  let hunksOmitted = 0;
  let oversized = 0;
  for (let i = 0; i < textFiles.length; i++) {
    const file = textFiles[i];
    const left = textFiles.length - i;
    const share = Math.min(remaining, LIMITS.perFileMax, Math.max(LIMITS.perFileMin, Math.floor(remaining / left)));
    if (remaining <= 0 || share <= 0) { file.omitted = 'budget'; budgetOmitted++; continue; }
    const paths = file.oldPath ? [file.oldPath, file.path] : [file.path];
    const raw = await git.fileDiff(baseSha, headSha, paths);
    if (raw === null) { file.omitted = 'oversized'; oversized++; continue; }
    const { header, hunks } = splitDiff(raw);
    file.hunksTotal = hunks.length;
    let used = bytes(header);
    const kept = [];
    for (const hunk of hunks) {
      const cost = bytes(hunk) + 1;
      if (used + cost > share) break;
      kept.push(hunk);
      used += cost;
    }
    file.hunksIncluded = kept.length;
    if (hunks.length && kept.length === 0) { file.omitted = 'budget'; budgetOmitted++; continue; }
    if (kept.length < hunks.length) { file.omitted = 'partial'; hunksOmitted += hunks.length - kept.length; }
    file.diff = [header, ...kept].join('\n');
    remaining -= used;
  }
  if (oversized) omissions.push({ kind: 'oversized', count: oversized, reason: 'Diffs too large to read were omitted.' });
  if (budgetOmitted) omissions.push({ kind: 'budget-files', count: budgetOmitted, reason: `Diffs omitted because the ${budget}-byte input budget was exhausted.` });
  if (hunksOmitted) omissions.push({ kind: 'budget-hunks', count: hunksOmitted, reason: 'Hunks dropped from files that exceeded their share of the input budget.' });

  const partial = omissions.some((o) => ['files-truncated', 'commits-truncated', 'oversized', 'budget-files', 'budget-hunks'].includes(o.kind));

  const evidence = {
    repository: context?.repository ?? null,
    base: revision.base,
    head: revision.head,
    rule: revision.rule,
    notes: revision.notes,
    commits,
    commitsTotal,
    files,
    filesTotal,
    discussion,
    omissions,
    partial,
    budget: { max: budget, used: budget - remaining },
    totals: {
      added: files.reduce((n, f) => n + (f.added ?? 0), 0),
      deleted: files.reduce((n, f) => n + (f.deleted ?? 0), 0),
    },
  };
  evidence.digest = digestEvidence(evidence);
  return evidence;
}

// Everything the model saw, hashed. Two runs on the same head with an edited
// PR body produce different digests, which is the point.
export function digestEvidence(evidence) {
  const canonical = JSON.stringify({
    base: evidence.base.sha ?? null, head: evidence.head.sha, rule: evidence.rule,
    commits: evidence.commits.map((c) => [c.sha, c.subject, c.body]),
    files: evidence.files.map((f) => [f.path, f.oldPath, f.status, f.added, f.deleted, f.category, f.diff, f.omitted]),
    discussion: evidence.discussion,
  });
  return `sha256:${createHash('sha256').update(canonical).digest('hex')}`;
}

async function collectDiscussion({ github, repository, number, omissions, log }) {
  try {
    const pr = await github.request('GET', `/repos/${repository}/pulls/${number}`);
    const body = truncateText(String(pr.body ?? ''), LIMITS.discussionBody);
    const discussion = {
      number,
      title: String(pr.title ?? '').slice(0, 300),
      author: pr.user?.login ?? null,
      body: body.text,
      bodyTruncated: body.truncated,
      comments: [],
      issues: [],
      url: pr.html_url ?? null,
    };
    let comments = [];
    try {
      comments = await github.paginate(`/repos/${repository}/issues/${number}/comments?per_page=100`, { limit: LIMITS.comments + 1 });
    } catch (error) {
      omissions.push({ kind: 'discussion-comments', count: 1, reason: `Pull request comments were not read: ${error.message}` });
    }
    for (const comment of comments.slice(0, LIMITS.comments)) {
      const text = truncateText(String(comment.body ?? ''), LIMITS.commentBody);
      discussion.comments.push({ author: comment.user?.login ?? null, body: text.text, truncated: text.truncated });
    }
    if (comments.length > LIMITS.comments) omissions.push({ kind: 'discussion-comments', count: comments.length - LIMITS.comments, reason: `Only the first ${LIMITS.comments} pull request comments were read.` });
    const referenced = [...new Set([...String(pr.body ?? '').matchAll(/(?:^|[\s(])#(\d{1,9})\b/g)].map((m) => Number(m[1])))].filter((n) => n !== number).slice(0, LIMITS.issues);
    for (const issueNumber of referenced) {
      try {
        const issue = await github.request('GET', `/repos/${repository}/issues/${issueNumber}`);
        const text = truncateText(String(issue.body ?? ''), LIMITS.commentBody);
        discussion.issues.push({ number: issueNumber, title: String(issue.title ?? '').slice(0, 300), body: text.text, truncated: text.truncated, pullRequest: Boolean(issue.pull_request) });
      } catch (error) {
        log(`Referenced issue #${issueNumber} was not read: ${error.message}`);
      }
    }
    return discussion;
  } catch (error) {
    omissions.push({ kind: 'discussion', count: 1, reason: `The pull request description was not read: ${error.message}` });
    return null;
  }
}

// Ids the model may cite. Anything else in `evidence` fields is rejected.
export function evidenceIndex(evidence) {
  const files = new Map();
  for (const f of evidence.files) { files.set(f.path, f); if (f.oldPath) files.set(f.oldPath, f); }
  const commits = new Map(evidence.commits.map((c) => [c.sha, c]));
  return {
    files, commits,
    resolve(ref) {
      const value = String(ref).trim();
      if (files.has(value)) return { kind: 'file', file: files.get(value) };
      if (/^[0-9a-f]{7,40}$/.test(value)) {
        const matches = [...commits.keys()].filter((sha) => sha.startsWith(value));
        if (matches.length === 1) return { kind: 'commit', commit: commits.get(matches[0]) };
      }
      return null;
    },
  };
}
