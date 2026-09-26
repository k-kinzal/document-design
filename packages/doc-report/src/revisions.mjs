// What is being compared with what. Refs are resolved to commit SHAs once
// and fixed for the rest of the run; the rule that chose them is recorded.
import { EMPTY_TREE, ZERO_SHA } from './version.mjs';

export class RevisionError extends Error {
  constructor(message, { skip = false, reason = null } = {}) {
    super(message);
    this.name = 'RevisionError';
    this.skip = skip;
    this.reason = reason;
  }
}

// A stable product tag: vMAJOR.MINOR.PATCH and nothing else. Moving aliases
// (v1, v1.2), the action's own report-* tags and pre-releases are excluded.
export const STABLE_TAG = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const SEMVER_TAG = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

export function parseVersion(tag) {
  const m = SEMVER_TAG.exec(tag);
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]), prerelease: m[4] ?? null };
}

export function compareVersions(a, b) {
  for (const key of ['major', 'minor', 'patch']) {
    if (a[key] !== b[key]) return a[key] > b[key] ? 1 : -1;
  }
  if (a.prerelease === b.prerelease) return 0;
  if (a.prerelease === null) return 1;
  if (b.prerelease === null) return -1;
  const left = a.prerelease.split('.');
  const right = b.prerelease.split('.');
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === undefined) return -1;
    if (right[i] === undefined) return 1;
    const ln = /^\d+$/.test(left[i]), rn = /^\d+$/.test(right[i]);
    if (ln && rn) { if (Number(left[i]) !== Number(right[i])) return Number(left[i]) > Number(right[i]) ? 1 : -1; }
    else if (ln !== rn) return ln ? -1 : 1;
    else if (left[i] !== right[i]) return left[i] > right[i] ? 1 : -1;
  }
  return 0;
}

async function resolveExplicit(git, ref, name) {
  const sha = await git.resolveCommit(ref);
  if (!sha) throw new RevisionError(`\`${name}\` ${JSON.stringify(ref)} does not resolve to a commit in the analysed repository. Fetch full history (fetch-depth: 0) and tags.`);
  return sha;
}

// Returns a revision description or throws RevisionError. A RevisionError
// with `skip: true` is a decision not to report rather than a failure.
export async function resolveRevision({ inputs, context, git }) {
  let mode = inputs.mode;
  if (mode === 'auto') {
    if (context.eventName === 'push' && context.ref.startsWith('refs/heads/')) mode = 'push';
    else if (context.eventName === 'pull_request' || context.eventName === 'pull_request_target') mode = 'pr';
    else throw new RevisionError(`mode \`auto\` cannot interpret the ${context.eventName || 'unknown'} event on ${context.ref || 'no ref'}; set mode to push, pr or range explicitly.`);
  }
  switch (mode) {
    case 'push': return resolvePush({ inputs, context, git });
    case 'pr': return resolvePullRequest({ inputs, context, git });
    case 'range': return resolveRange({ inputs, git });
    case 'release': return resolveRelease({ inputs, context, git });
    default: throw new RevisionError(`Unsupported mode ${mode}`);
  }
}

async function resolvePush({ inputs, context, git }) {
  if (inputs.base || inputs.head) {
    // Explicit refs under push mode: still a direct tree comparison.
    return resolveRange({ inputs, git, mode: 'push' });
  }
  const event = context.event;
  if (context.eventName !== 'push' || !event || typeof event.before !== 'string' || typeof event.after !== 'string') {
    throw new RevisionError('mode `push` needs a push event payload with `before` and `after`; for other triggers pass base and head.');
  }
  const { before, after, forced = false } = event;
  const notes = [];
  if (after === ZERO_SHA) {
    throw new RevisionError('The push deleted the ref; there is no tree to report.', { skip: true, reason: 'ref-deleted' });
  }
  if (!(await git.commitExists(after))) {
    throw new RevisionError(`The pushed commit ${after} is not in the checkout. Check out ${after} with full history.`);
  }
  if (before === ZERO_SHA) {
    notes.push('The ref was created by this push, so the comparison starts from an empty tree and describes the initial contents, not a change from a previous state.');
    return revision({ mode: 'push', rule: 'push-initial', baseRef: 'empty tree', baseSha: null, headRef: context.ref, headSha: after, notes, forced });
  }
  if (!(await git.commitExists(before))) {
    throw new RevisionError(`The previous commit ${before} is not available in the checkout${forced ? ' (force push)' : ''}. It may have been rewritten; run a manual range comparison with an explicit base instead of guessing a parent.`);
  }
  if (forced) notes.push('This was a force push. The comparison is between the previous tip and the new tip; the history between them is not linear.');
  return revision({ mode: 'push', rule: forced ? 'push-forced' : 'push', baseRef: before, baseSha: before, headRef: context.ref, headSha: after, notes, forced });
}

async function resolvePullRequest({ inputs, context, git }) {
  const pr = context.event?.pull_request;
  const number = inputs.prNumber ?? pr?.number ?? null;
  if (!number) throw new RevisionError('mode `pr` needs a pull_request event or an explicit pr-number.');
  const headSha = inputs.head ? await resolveExplicit(git, inputs.head, 'head') : pr?.head?.sha;
  if (!headSha) throw new RevisionError('The pull request head SHA is unknown; provide head or run on a pull_request event.');
  if (!(await git.commitExists(headSha))) throw new RevisionError(`The pull request head ${headSha} is not in the checkout. Check out the PR head with full history.`);
  const targetBaseSha = pr?.base?.sha ?? null;
  const notes = [];
  let baseSha, rule;
  if (inputs.base) {
    baseSha = await resolveExplicit(git, inputs.base, 'base');
    rule = 'pr-explicit-base';
  } else {
    if (!targetBaseSha) throw new RevisionError('The pull request target base SHA is unknown; provide base explicitly.');
    if (!(await git.commitExists(targetBaseSha))) throw new RevisionError(`The target base ${targetBaseSha} is not in the checkout. Fetch the base branch (fetch-depth: 0).`);
    const bases = await git.mergeBases(targetBaseSha, headSha);
    if (bases.length === 0) throw new RevisionError('The pull request head and its target base share no history; provide base explicitly.');
    if (bases.length > 1) throw new RevisionError(`The merge base is ambiguous (${bases.length} candidates: ${bases.map((b) => b.slice(0, 7)).join(', ')}); provide base explicitly.`);
    baseSha = bases[0];
    rule = 'pr-merge-base';
  }
  notes.push('The comparison covers the whole pull request: from the merge base with the target branch to the head commit, not the last push alone.');
  return revision({ mode: 'pr', rule, baseRef: inputs.base ?? `merge-base(${targetBaseSha?.slice(0, 7)}, ${headSha.slice(0, 7)})`, baseSha, headRef: inputs.head ?? pr?.head?.ref ?? headSha, headSha, notes, pr: { number, targetBaseSha, headRef: pr?.head?.ref ?? null, baseRef: pr?.base?.ref ?? null, fork: pr ? pr.head?.repo?.full_name !== pr.base?.repo?.full_name : null, draft: pr?.draft ?? null } });
}

async function resolveRange({ inputs, git, mode = 'range' }) {
  if (!inputs.head) throw new RevisionError('mode `range` requires `head`.');
  if (!inputs.base) throw new RevisionError('mode `range` requires `base`.');
  const headSha = await resolveExplicit(git, inputs.head, 'head');
  const baseSha = await resolveExplicit(git, inputs.base, 'base');
  const notes = [];
  if (!(await git.isAncestor(baseSha, headSha))) {
    notes.push('The base is not an ancestor of the head. The two trees are compared directly; the commit list contains commits reachable from the head but not from the base.');
  }
  return revision({ mode, rule: 'range-direct', baseRef: inputs.base, baseSha, headRef: inputs.head, headSha, notes });
}

async function resolveRelease({ inputs, context, git }) {
  let headRef = inputs.head;
  if (!headRef) {
    if (context.eventName === 'release' && context.event?.release?.tag_name) headRef = String(context.event.release.tag_name);
    else if (context.eventName === 'push' && context.ref.startsWith('refs/tags/')) headRef = context.ref.slice('refs/tags/'.length);
    else throw new RevisionError('The release action needs `head` unless it runs on a release event or a tag push.');
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._\/+-]{0,255}$/.test(headRef)) throw new RevisionError(`Unsafe tag name ${JSON.stringify(headRef)}`);
  const headSha = await resolveExplicit(git, headRef, 'head');
  const notes = [];
  if (inputs.base) {
    const baseSha = await resolveExplicit(git, inputs.base, 'base');
    if (!(await git.isAncestor(baseSha, headSha))) notes.push('The explicit base is not an ancestor of the head; the trees are compared directly.');
    return revision({ mode: 'release', rule: 'release-explicit-base', baseRef: inputs.base, baseSha, headRef, headSha, notes, release: { tag: headRef } });
  }
  const choice = await previousStable({ git, headRef, headSha });
  if (choice.base) {
    notes.push(`The base is the previous stable release ${choice.base.name}: the highest vMAJOR.MINOR.PATCH tag below ${headRef} whose commit is an ancestor of the head. ${choice.considered} stable tags were considered.`);
    return revision({ mode: 'release', rule: 'release-previous-stable', baseRef: choice.base.name, baseSha: choice.base.commit, headRef, headSha, notes, release: { tag: headRef, candidates: choice.considered } });
  }
  if (choice.considered > 0) {
    throw new RevisionError(`No stable tag below ${headRef} is an ancestor of it (${choice.considered} stable tags exist on other history). This is not an initial release; provide base explicitly.`);
  }
  if (inputs.initialRelease === 'error') throw new RevisionError(`No previous stable tag exists before ${headRef}, and initial-release is set to error.`);
  notes.push(`No previous stable tag exists, so ${headRef} is described as an initial release from an empty tree.`);
  return revision({ mode: 'release', rule: 'release-initial', baseRef: 'empty tree', baseSha: null, headRef, headSha, notes, release: { tag: headRef, candidates: 0 } });
}

// The previous stable release: max SemVer among stable tags that are below
// the head version (or, for an unversioned head, strictly older commits) and
// whose commit is an ancestor of the head commit.
export async function previousStable({ git, headRef, headSha }) {
  const headVersion = parseVersion(headRef);
  const tags = (await git.tags()).filter((t) => STABLE_TAG.test(t.name) && t.commit);
  const candidates = [];
  for (const tag of tags) {
    const version = parseVersion(tag.name);
    if (headVersion) {
      if (compareVersions(version, headVersion) >= 0) continue;
    } else if (tag.commit === headSha) continue;
    if (tag.name === headRef) continue;
    candidates.push({ ...tag, version });
  }
  let considered = candidates.length;
  const ancestors = [];
  for (const tag of candidates) {
    if (tag.commit === headSha || (await git.isAncestor(tag.commit, headSha))) ancestors.push(tag);
  }
  ancestors.sort((a, b) => compareVersions(b.version, a.version));
  return { base: ancestors[0] ?? null, considered: headVersion ? considered : considered };
}

function revision({ mode, rule, baseRef, baseSha, headRef, headSha, notes = [], pr = null, release = null, forced = false }) {
  return {
    mode, rule,
    base: { ref: baseRef, sha: baseSha, tree: baseSha ? null : EMPTY_TREE },
    head: { ref: headRef, sha: headSha },
    notes, pr, release, forced,
  };
}

// Fill in tree ids once the SHAs are known, so an "empty diff" can be
// decided from trees rather than from a diff that happened to be empty.
export async function attachTrees(git, rev) {
  rev.head.tree = await git.treeOf(rev.head.sha);
  if (rev.base.sha) rev.base.tree = await git.treeOf(rev.base.sha);
  rev.sameTree = rev.base.tree === rev.head.tree;
  return rev;
}
