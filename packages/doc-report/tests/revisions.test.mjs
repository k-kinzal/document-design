import test from 'node:test';
import assert from 'node:assert/strict';
import { createGit } from '../src/git.mjs';
import { RevisionError, attachTrees, compareVersions, parseVersion, previousStable, resolveRevision } from '../src/revisions.mjs';
import { EMPTY_TREE, ZERO_SHA } from '../src/version.mjs';
import { fakeContext, fakeInputs, makeRepo } from './helpers.mjs';

const resolve = (repo, inputs, context) => resolveRevision({ inputs: fakeInputs({ repositoryPath: repo.dir, ...inputs }), context: fakeContext(context), git: createGit(repo.dir) });

test('SemVer ordering: v1.10.0 is newer than v1.9.0 and pre-releases sort below', () => {
  assert.equal(compareVersions(parseVersion('v1.10.0'), parseVersion('v1.9.0')), 1);
  assert.equal(compareVersions(parseVersion('v2.0.0-rc.1'), parseVersion('v2.0.0')), -1);
  assert.equal(compareVersions(parseVersion('v2.0.0-rc.2'), parseVersion('v2.0.0-rc.10')), -1);
  assert.equal(parseVersion('report-v1.0.0'), null);
  assert.equal(parseVersion('v1'), null);
});

test('push: a multi-commit push compares before with after, not HEAD^ with HEAD', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const before = repo.commit({ 'a.txt': '1' }, 'first');
  repo.commit({ 'a.txt': '2' }, 'second');
  const after = repo.commit({ 'b.txt': 'x' }, 'third');
  const rev = await resolve(repo, { mode: 'push' }, { eventName: 'push', event: { before, after, forced: false } });
  assert.equal(rev.rule, 'push');
  assert.equal(rev.base.sha, before);
  assert.equal(rev.head.sha, after);
});

test('push: a created ref starts from the empty tree and says so', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const after = repo.commit({ 'a.txt': '1' }, 'first');
  const rev = await resolve(repo, { mode: 'push' }, { eventName: 'push', event: { before: ZERO_SHA, after } });
  assert.equal(rev.rule, 'push-initial');
  assert.equal(rev.base.sha, null);
  assert.equal(rev.base.tree, EMPTY_TREE);
  assert.match(rev.notes[0], /empty tree/);
});

test('push: a deleted ref is skipped, not failed', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const before = repo.commit({ 'a.txt': '1' }, 'first');
  await assert.rejects(resolve(repo, { mode: 'push' }, { eventName: 'push', event: { before, after: ZERO_SHA } }), (e) => e instanceof RevisionError && e.skip && e.reason === 'ref-deleted');
});

test('push: a force push is recorded; an unavailable before fails with a reason', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const before = repo.commit({ 'a.txt': '1' }, 'first');
  const after = repo.commit({ 'a.txt': '2' }, 'second');
  const rev = await resolve(repo, { mode: 'push' }, { eventName: 'push', event: { before, after, forced: true } });
  assert.equal(rev.rule, 'push-forced');
  assert.match(rev.notes.join(' '), /force push/);
  await assert.rejects(resolve(repo, { mode: 'push' }, { eventName: 'push', event: { before: 'f'.repeat(40), after, forced: true } }), /not available in the checkout/);
});

test('auto: branch pushes and pull requests are recognised; other events are refused', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const before = repo.commit({ 'a.txt': '1' }, 'first');
  const after = repo.commit({ 'a.txt': '2' }, 'second');
  const rev = await resolve(repo, { mode: 'auto' }, { eventName: 'push', ref: 'refs/heads/main', event: { before, after } });
  assert.equal(rev.mode, 'push');
  await assert.rejects(resolve(repo, { mode: 'auto' }, { eventName: 'schedule', ref: 'refs/heads/main' }), /cannot interpret/);
  await assert.rejects(resolve(repo, { mode: 'auto' }, { eventName: 'push', ref: 'refs/tags/v1.0.0', event: { before, after } }), /cannot interpret/);
});

test('pr: the whole pull request from the merge base, with target base recorded separately', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const root = repo.commit({ 'a.txt': '1' }, 'root');
  repo.branch('feature');
  repo.commit({ 'f.txt': 'a' }, 'feature 1');
  const head = repo.commit({ 'f.txt': 'b' }, 'feature 2');
  repo.checkout('main');
  const mainTip = repo.commit({ 'm.txt': 'x' }, 'main moved');
  const event = { pull_request: { number: 7, head: { sha: head, ref: 'feature', repo: { full_name: 'octo/consumer' } }, base: { sha: mainTip, ref: 'main', repo: { full_name: 'octo/consumer' } }, draft: false } };
  const rev = await resolve(repo, { mode: 'pr' }, { eventName: 'pull_request', event, sha: 'merge-sha-not-used' });
  assert.equal(rev.rule, 'pr-merge-base');
  assert.equal(rev.base.sha, root);
  assert.equal(rev.head.sha, head);
  assert.equal(rev.pr.number, 7);
  assert.equal(rev.pr.targetBaseSha, mainTip);
  assert.equal(rev.pr.fork, false);
});

test('pr: an explicit base wins; a fork is flagged; an ambiguous merge base is refused', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const root = repo.commit({ 'a.txt': '1' }, 'root');
  repo.branch('x');
  const x1 = repo.commit({ 'x.txt': '1' }, 'x1');
  repo.checkout('main');
  repo.branch('y');
  const y1 = repo.commit({ 'y.txt': '1' }, 'y1');
  // criss-cross: x merges y, y merges x → two merge bases
  repo.checkout('x');
  repo.merge('y');
  const xTip = repo.commit({ 'x.txt': '2' }, 'x2');
  repo.checkout('y');
  repo.git('merge', '-q', '--no-edit', '--no-ff', x1);
  const yTip = repo.commit({ 'y.txt': '2' }, 'y2');
  const pr = (extra = {}) => ({ pull_request: { number: 1, head: { sha: xTip, ref: 'x', repo: { full_name: 'fork/consumer' } }, base: { sha: yTip, ref: 'y', repo: { full_name: 'octo/consumer' } }, ...extra } });
  await assert.rejects(resolve(repo, { mode: 'pr' }, { eventName: 'pull_request', event: pr() }), /ambiguous/);
  const rev = await resolve(repo, { mode: 'pr', base: root }, { eventName: 'pull_request', event: pr() });
  assert.equal(rev.rule, 'pr-explicit-base');
  assert.equal(rev.pr.fork, true);
  assert.equal(y1.length, 40);
});

test('range: annotated and lightweight tags peel to commits; non-ancestors are compared directly', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const c1 = repo.commit({ 'a.txt': '1' }, 'one');
  repo.tag('v1.0.0', { annotated: true });
  const c2 = repo.commit({ 'a.txt': '2' }, 'two');
  repo.tag('light');
  const git = createGit(repo.dir);
  const rev = await attachTrees(git, await resolve(repo, { mode: 'range', base: 'v1.0.0', head: 'light' }));
  assert.equal(rev.base.sha, c1);
  assert.equal(rev.head.sha, c2);
  assert.equal(rev.sameTree, false);
  const same = await attachTrees(git, await resolve(repo, { mode: 'range', base: 'v1.0.0', head: c1 }));
  assert.equal(same.sameTree, true);
  repo.checkout(c1);
  repo.branch('other');
  const other = repo.commit({ 'z.txt': 'z' }, 'elsewhere');
  const direct = await resolve(repo, { mode: 'range', base: c2, head: other });
  assert.match(direct.notes.join(' '), /not an ancestor/);
  await assert.rejects(resolve(repo, { mode: 'range', head: c2 }), /requires `base`/);
  await assert.rejects(resolve(repo, { mode: 'range', base: 'nope', head: c2 }), /does not resolve/);
});

test('release: the previous stable tag is the highest SemVer ancestor, never an alias or a report tag', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  repo.commit({ 'a.txt': '1' }, 'one');
  repo.tag('v1.9.0', { annotated: true });
  repo.commit({ 'a.txt': '2' }, 'two');
  const v110 = repo.tag('v1.10.0');
  repo.tag('v1');
  repo.tag('v1.10');
  repo.tag('report-v1');
  repo.tag('report-v1.0.0');
  repo.commit({ 'a.txt': '3' }, 'three');
  repo.tag('v2.0.0-rc.1');
  const head = repo.commit({ 'a.txt': '4' }, 'four');
  repo.tag('v2.0.0');
  const git = createGit(repo.dir);
  const choice = await previousStable({ git, headRef: 'v2.0.0', headSha: head });
  assert.equal(choice.base.name, 'v1.10.0');
  assert.equal(choice.base.commit, v110);
  const rev = await resolve(repo, { mode: 'release', head: 'v2.0.0' }, { eventName: 'workflow_dispatch' });
  assert.equal(rev.rule, 'release-previous-stable');
  assert.equal(rev.base.ref, 'v1.10.0');
  // A pre-release head still takes the previous stable.
  const rc = await resolve(repo, { mode: 'release', head: 'v2.0.0-rc.1' }, { eventName: 'workflow_dispatch' });
  assert.equal(rc.base.ref, 'v1.10.0');
});

test('release: the head comes from the tag push or the release event; explicit base wins', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const c1 = repo.commit({ 'a.txt': '1' }, 'one');
  repo.tag('v1.0.0');
  repo.commit({ 'a.txt': '2' }, 'two');
  repo.tag('v1.1.0');
  const fromPush = await resolve(repo, { mode: 'release' }, { eventName: 'push', ref: 'refs/tags/v1.1.0' });
  assert.equal(fromPush.head.ref, 'v1.1.0');
  assert.equal(fromPush.base.ref, 'v1.0.0');
  const fromRelease = await resolve(repo, { mode: 'release' }, { eventName: 'release', event: { release: { tag_name: 'v1.1.0' } } });
  assert.equal(fromRelease.release.tag, 'v1.1.0');
  const explicit = await resolve(repo, { mode: 'release', base: c1, head: 'v1.1.0' }, { eventName: 'workflow_dispatch' });
  assert.equal(explicit.rule, 'release-explicit-base');
  await assert.rejects(resolve(repo, { mode: 'release' }, { eventName: 'workflow_dispatch' }), /needs `head`/);
});

test('release: same-commit tags, initial releases and tags on other history', async (t) => {
  const repo = makeRepo();
  t.after(repo.cleanup);
  const c1 = repo.commit({ 'a.txt': '1' }, 'one');
  // No stable tag yet: initial release, from the empty tree or an error.
  repo.tag('v0.1.0');
  const initial = await resolve(repo, { mode: 'release', head: 'v0.1.0' }, { eventName: 'workflow_dispatch' });
  assert.equal(initial.rule, 'release-initial');
  assert.equal(initial.base.tree, EMPTY_TREE);
  await assert.rejects(resolve(repo, { mode: 'release', head: 'v0.1.0', initialRelease: 'error' }, { eventName: 'workflow_dispatch' }), /initial-release is set to error/);
  // Two versions on one commit: the lower one is the previous release.
  repo.tag('v0.1.1');
  const same = await resolve(repo, { mode: 'release', head: 'v0.1.1' }, { eventName: 'workflow_dispatch' });
  assert.equal(same.base.ref, 'v0.1.0');
  assert.equal(same.base.sha, c1);
  // A stable tag that exists only on unrelated history is not a base.
  repo.git('checkout', '-q', '--orphan', 'other');
  repo.git('rm', '-rfq', '.');
  repo.commit({ 'o.txt': 'o' }, 'orphan');
  repo.tag('v0.2.0');
  repo.git('checkout', '-q', 'main');
  repo.commit({ 'a.txt': '2' }, 'two');
  repo.tag('v0.3.0');
  const later = await resolve(repo, { mode: 'release', head: 'v0.3.0' }, { eventName: 'workflow_dispatch' });
  assert.equal(later.base.ref, 'v0.1.1');
  repo.git('tag', '-d', 'v0.1.0');
  repo.git('tag', '-d', 'v0.1.1');
  await assert.rejects(resolve(repo, { mode: 'release', head: 'v0.3.0' }, { eventName: 'workflow_dispatch' }), /not an initial release/);
});
