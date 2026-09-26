import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PublishError, artifactPattern, assetName, publishPullRequest, publishRelease, selectArtifacts } from '../src/publish.mjs';
import { marker, parseCommentMeta, prCommentBody } from '../src/summary.mjs';
import { apiError, fakeClient, fakeContext } from './helpers.mjs';
import { makeZip } from './zip.test.mjs';

const HEAD = 'b'.repeat(40);
const BASE = 'a'.repeat(40);
const REPO = 'octo/consumer';
const RUN = 10;
const html = Buffer.from('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><style></style></head><body>report</body></html>');
const digest = `sha256:${createHash('sha256').update(html).digest('hex')}`;

const manifest = (extra = {}) => ({ schema: 1, repository: REPO, reportId: 'default', run: { id: String(RUN), attempt: 1 }, head: { sha: HEAD, ref: 'feature' }, base: { sha: BASE }, status: 'complete', language: 'en', evidence: { digest: 'sha256:e' }, generatedAt: '2026-09-26T00:00:00Z', html: { digest }, artifact: { id: 5 }, pullRequest: { number: 3 }, release: null, ...extra });

const artifacts = () => [
  { id: 5, name: `document-design-default-${HEAD.slice(0, 7)}-${RUN}-1.html`, expired: false, created_at: '2026-09-26T00:00:00Z', expires_at: '2026-10-26T00:00:00Z' },
  { id: 6, name: `document-design-default-${HEAD.slice(0, 7)}-${RUN}-1.manifest.json`, expired: false },
  { id: 7, name: 'unrelated', expired: false },
];

function prRoutes({ prHead = HEAD, comments = [], manifestBody = manifest(), zipped = true, extra = {} } = {}) {
  const posted = [];
  const patched = [];
  const routes = {
    [`GET /repos/${REPO}/actions/runs/${RUN}`]: { id: RUN, run_attempt: 1, head_sha: HEAD, event: 'pull_request', repository: { full_name: REPO }, pull_requests: [{ number: 3 }], html_url: `https://github.com/${REPO}/actions/runs/${RUN}` },
    [`GET /repos/${REPO}/pulls/3`]: () => ({ number: 3, head: { sha: prHead }, base: { sha: 'c'.repeat(40) } }),
    [`GET /repos/${REPO}/issues/3/comments`]: comments,
    [`GET /repos/${REPO}/actions/runs/${RUN}/artifacts`]: artifacts(),
    [`GET /repos/${REPO}/actions/artifacts/6/zip`]: zipped ? makeZip('x.manifest.json', JSON.stringify(manifestBody), { deflate: true }) : Buffer.from(JSON.stringify(manifestBody)),
    [`POST /repos/${REPO}/issues/3/comments`]: (body) => { posted.push(body); return { id: 100, html_url: 'https://github.com/octo/consumer/pull/3#issuecomment-100' }; },
    [`PATCH /repos/${REPO}/issues/comments/*`]: (body, url) => { patched.push({ id: url.pathname.split('/').pop(), body }); return { id: 77, html_url: 'https://github.com/octo/consumer/pull/3#issuecomment-77' }; },
    ...extra,
  };
  return { client: fakeClient(routes), posted, patched };
}

const prInputs = (extra = {}) => ({ token: 't', target: 'pr', reportId: 'default', sourceRunId: RUN, prNumber: 3, generationResult: 'success', commentAuthor: 'github-actions[bot]', ...extra });
const context = fakeContext({ repository: REPO });

test('artifact names encode report id, head, run and attempt; the newest attempt wins', () => {
  assert.ok(artifactPattern('default', 10).test('document-design-default-abcdef0-10-2.html'));
  assert.ok(!artifactPattern('default', 10).test('document-design-other-abcdef0-10-2.html'));
  assert.ok(!artifactPattern('default', 10).test('document-design-default-abcdef0-11-2.html'));
  const chosen = selectArtifacts([{ id: 1, name: 'document-design-x-abcdef0-10-1.html' }, { id: 2, name: 'document-design-x-abcdef0-10-2.html' }, { id: 3, name: 'document-design-x-abcdef0-10-2.manifest.json' }], 'x', 10);
  assert.equal(chosen.html.id, 2);
  assert.equal(chosen.manifest.id, 3);
});

test('first report on a pull request posts a new comment with the marker and metadata', async () => {
  const { client, posted } = prRoutes();
  const result = await publishPullRequest({ inputs: prInputs(), context, client });
  assert.equal(result.outcome, 'posted');
  assert.equal(posted.length, 1);
  const body = posted[0].body;
  assert.ok(body.startsWith(marker('default')));
  const meta = parseCommentMeta(body);
  assert.equal(meta.head, HEAD);
  assert.equal(meta.base, BASE);
  assert.equal(meta.url, `https://github.com/${REPO}/actions/runs/${RUN}/artifacts/5`);
  assert.equal(meta.retention, 30);
  assert.match(body, /\*\*View HTML report\*\*: https:\/\/github\.com\/octo\/consumer\/actions\/runs\/10\/artifacts\/5/);
  assert.match(body, /Status: Complete/);
});

test('a raw (non-zipped) manifest download is accepted too', async () => {
  const { client, posted } = prRoutes({ zipped: false });
  const result = await publishPullRequest({ inputs: prInputs(), context, client });
  assert.equal(result.outcome, 'posted');
  assert.equal(posted.length, 1);
});

test('an existing comment by the expected author is updated; the same marker from someone else is left alone', async () => {
  const ours = prCommentBody({ reportId: 'default', meta: { v: 1, repo: REPO, pr: 3, head: 'old'.padEnd(40, '0'), run: 9, attempt: 1, outcome: 'success', url: 'https://old', artifact: 1, status: 'complete', run_url: 'r' }, outcome: 'success' });
  const comments = [
    { id: 50, body: ours, user: { login: 'someone-else' } },
    { id: 60, body: ours, user: { login: 'github-actions[bot]' } },
    { id: 61, body: 'unrelated', user: { login: 'github-actions[bot]' } },
  ];
  const { client, posted, patched } = prRoutes({ comments });
  const result = await publishPullRequest({ inputs: prInputs(), context, client });
  assert.equal(result.outcome, 'updated');
  assert.equal(posted.length, 0);
  assert.equal(patched.length, 1);
  assert.equal(patched[0].id, '60');
});

test('a report for a head the pull request has moved past is not posted', async () => {
  const { client, posted, patched } = prRoutes({ prHead: 'f'.repeat(40) });
  const result = await publishPullRequest({ inputs: prInputs(), context, client });
  assert.equal(result.outcome, 'superseded');
  assert.equal(posted.length + patched.length, 0);
});

test('a re-run of an older run does not roll back a newer comment for the same head', async () => {
  const newer = prCommentBody({ reportId: 'default', meta: { v: 1, repo: REPO, pr: 3, head: HEAD, run: 11, attempt: 1, outcome: 'success', url: 'https://new', artifact: 2, status: 'complete', run_url: 'r' }, outcome: 'success' });
  const { client, posted, patched } = prRoutes({ comments: [{ id: 60, body: newer, user: { login: 'github-actions[bot]' } }] });
  const result = await publishPullRequest({ inputs: prInputs(), context, client });
  assert.equal(result.outcome, 'skipped');
  assert.equal(posted.length + patched.length, 0);
  const sameRunLaterAttempt = prCommentBody({ reportId: 'default', meta: { v: 1, repo: REPO, pr: 3, head: HEAD, run: RUN, attempt: 2, outcome: 'success', url: 'https://new', artifact: 2, status: 'complete', run_url: 'r' }, outcome: 'success' });
  const again = prRoutes({ comments: [{ id: 60, body: sameRunLaterAttempt, user: { login: 'github-actions[bot]' } }] });
  assert.equal((await publishPullRequest({ inputs: prInputs(), context, client: again.client })).outcome, 'skipped');
});

test('a failed generation posts a failure comment that keeps the previous link and checks whether it expired', async () => {
  const previous = prCommentBody({ reportId: 'default', meta: { v: 1, repo: REPO, pr: 3, head: 'd'.repeat(40), run: 9, attempt: 1, outcome: 'success', url: 'https://github.com/octo/consumer/actions/runs/9/artifacts/1', artifact: 1, status: 'complete', run_url: 'r' }, outcome: 'success' });
  const { client, patched } = prRoutes({ comments: [{ id: 60, body: previous, user: { login: 'github-actions[bot]' } }], extra: { [`GET /repos/${REPO}/actions/artifacts/1`]: { id: 1, expired: true } } });
  const result = await publishPullRequest({ inputs: prInputs({ generationResult: 'failure' }), context, client });
  assert.equal(result.outcome, 'failure-posted');
  assert.equal(patched.length, 1);
  const body = patched[0].body.body;
  assert.match(body, /Report generation failed for `bbbbbbbbbbbb`/);
  assert.match(body, /Previous report \(for `dddddddddddd`\) \(expired\): https:\/\/github\.com\/octo\/consumer\/actions\/runs\/9\/artifacts\/1/);
  assert.ok(!/View HTML report/.test(body), 'no fabricated success link');
  const meta = parseCommentMeta(body);
  assert.equal(meta.outcome, 'failure');
  assert.equal(meta.last_success.head, 'd'.repeat(40));
});

test('a skipped or cancelled generation posts nothing', async () => {
  for (const generationResult of ['skipped', 'cancelled']) {
    const { client, posted } = prRoutes();
    const result = await publishPullRequest({ inputs: prInputs({ generationResult }), context, client });
    assert.equal(result.outcome, 'skipped');
    assert.equal(posted.length, 0);
  }
});

test('a manifest that disagrees with the run or the pull request is refused', async () => {
  for (const bad of [manifest({ head: { sha: 'e'.repeat(40) } }), manifest({ run: { id: '99' } }), manifest({ repository: 'other/repo' }), manifest({ reportId: 'other' }), manifest({ pullRequest: { number: 4 } }), manifest({ artifact: { id: 999 } })]) {
    const { client, posted } = prRoutes({ manifestBody: bad });
    await assert.rejects(publishPullRequest({ inputs: prInputs(), context, client }), PublishError);
    assert.equal(posted.length, 0);
  }
});

test('runs from another repository and missing artifacts are handled', async () => {
  const other = prRoutes({ extra: { [`GET /repos/${REPO}/actions/runs/${RUN}`]: { id: RUN, repository: { full_name: 'else/where' }, head_sha: HEAD } } });
  await assert.rejects(publishPullRequest({ inputs: prInputs(), context, client: other.client }), /belongs to else\/where/);
  const none = prRoutes({ extra: { [`GET /repos/${REPO}/actions/runs/${RUN}/artifacts`]: [] } });
  const result = await publishPullRequest({ inputs: prInputs(), context, client: none.client });
  assert.equal(result.outcome, 'failure-posted');
  assert.equal(result.generationFailed, true);
  const expired = prRoutes({ extra: { [`GET /repos/${REPO}/actions/runs/${RUN}/artifacts`]: artifacts().map((a) => ({ ...a, expired: true })) } });
  await assert.rejects(publishPullRequest({ inputs: prInputs(), context, client: expired.client }), /expired/);
});

test('a missing write permission is reported without pretending success', async () => {
  const { client } = prRoutes({ extra: { [`POST /repos/${REPO}/issues/3/comments`]: apiError(403, 'Resource not accessible by integration') } });
  await assert.rejects(publishPullRequest({ inputs: prInputs(), context, client }), /pull-requests: write/);
});

// ---- release ----

function releaseRoutes({ releases = [], tagRef = { object: { type: 'tag', sha: 'T' } }, tagObject = { object: { sha: HEAD } }, manifestBody = manifest({ pullRequest: null, release: { tag: 'v1.1.0' }, head: { sha: HEAD, ref: 'v1.1.0' }, reportId: 'release' }), extra = {} } = {}) {
  const created = [];
  const uploaded = [];
  const patched = [];
  const deleted = [];
  const release = { id: 1, tag_name: 'v1.1.0', draft: true, immutable: false, body: '## Notes\n\nHand-written.', assets: [], upload_url: 'https://uploads.github.com/repos/octo/consumer/releases/1/assets{?name,label}', html_url: 'https://github.com/octo/consumer/releases/tag/v1.1.0' };
  const routes = {
    [`GET /repos/${REPO}/actions/runs/${RUN}`]: { id: RUN, run_attempt: 1, head_sha: HEAD, event: 'workflow_dispatch', repository: { full_name: REPO }, html_url: 'https://run' },
    [`GET /repos/${REPO}/actions/runs/${RUN}/artifacts`]: artifacts().map((a) => ({ ...a, name: a.name.replace('-default-', '-release-') })),
    [`GET /repos/${REPO}/actions/artifacts/6/zip`]: makeZip('m.json', JSON.stringify(manifestBody)),
    [`GET /repos/${REPO}/actions/artifacts/5/zip`]: makeZip('r.html', html),
    [`GET /repos/${REPO}/git/ref/tags/v1.1.0`]: tagRef,
    [`GET /repos/${REPO}/git/tags/T`]: tagObject,
    [`GET /repos/${REPO}/releases`]: () => releases,
    [`POST /repos/${REPO}/releases`]: (body) => { created.push(body); return release; },
    [`POST /repos/${REPO}/releases/1/assets`]: (body, url) => { const name = url.searchParams.get('name'); uploaded.push({ name, bytes: body.length }); return { id: 500 + uploaded.length, name, browser_download_url: `https://github.com/octo/consumer/releases/download/v1.1.0/${name}` }; },
    [`PATCH /repos/${REPO}/releases/1`]: (body) => { patched.push(body); return { ...release, ...body }; },
    [`PATCH /repos/${REPO}/releases/assets/*`]: (body, url) => ({ id: Number(url.pathname.split('/').pop()), name: body.name, browser_download_url: `https://github.com/octo/consumer/releases/download/v1.1.0/${body.name}` }),
    [`DELETE /repos/${REPO}/releases/assets/*`]: (body, url) => { deleted.push(url.pathname.split('/').pop()); return null; },
    ...extra,
  };
  return { client: fakeClient(routes), created, uploaded, patched, deleted, release };
}

const releaseInputs = (extra = {}) => ({ token: 't', target: 'release', reportId: 'release', sourceRunId: RUN, generationResult: 'success', releaseTag: 'v1.1.0', createDraft: false, updateReleaseBody: true, replaceAssets: false, ...extra });

test('asset names are stable and safe, with a digest suffix only when the tag had unsafe characters', () => {
  assert.equal(assetName('release', 'v1.2.3'), 'document-design-release-v1.2.3.html');
  const odd = assetName('release', 'v1.2.3/odd tag');
  assert.match(odd, /^document-design-release-v1\.2\.3-odd-tag-[0-9a-f]{8}\.html$/);
  assert.notEqual(assetName('release', 'a/b'), assetName('release', 'a b'));
});

test('without a release nothing is created unless create-draft is set; drafts are created for existing tags only', async () => {
  const none = releaseRoutes();
  await assert.rejects(publishRelease({ inputs: releaseInputs(), context, client: none.client }), /create-draft: true/);
  assert.equal(none.created.length, 0);
  const draft = releaseRoutes();
  const result = await publishRelease({ inputs: releaseInputs({ createDraft: true }), context, client: draft.client });
  assert.equal(result.outcome, 'attached');
  assert.equal(result.draft, true);
  assert.equal(result.created, true);
  assert.deepEqual(draft.created[0], { tag_name: 'v1.1.0', name: 'v1.1.0', draft: true, body: '' });
  assert.equal(draft.uploaded[0].name, 'document-design-release-v1.1.0.html');
  assert.equal(draft.uploaded[0].bytes, html.length);
  assert.match(draft.patched[0].body, /^## Notes\n\nHand-written\.\n\n<!-- document-design:report:release:start -->/);
  assert.match(draft.patched[0].body, /Download the HTML report \(release asset\): https:\/\/github\.com\/octo\/consumer\/releases\/download\/v1\.1\.0\/document-design-release-v1\.1\.0\.html/);
  const missingTag = releaseRoutes({ tagRef: apiError(404, 'Not Found') });
  await assert.rejects(publishRelease({ inputs: releaseInputs({ createDraft: true }), context, client: missingTag.client }), /does not create tags/);
});

test('the tag must point at the commit the report describes', async () => {
  const wrong = releaseRoutes({ tagObject: { object: { sha: 'f'.repeat(40) } } });
  await assert.rejects(publishRelease({ inputs: releaseInputs({ createDraft: true }), context, client: wrong.client }), /points at ffffffffffff/);
});

test('the same digest is reused; a different one is a conflict unless replace-assets is allowed', async () => {
  const existing = { id: 300, name: 'document-design-release-v1.1.0.html', digest, browser_download_url: 'https://dl/existing' };
  const reuse = releaseRoutes();
  reuse.release.assets = [existing];
  const r1 = await publishRelease({ inputs: releaseInputs(), context, client: releaseRoutes({ releases: [reuse.release] }).client });
  assert.equal(r1.outcome, 'reused');
  assert.equal(r1.assetUrl, 'https://dl/existing');
  const different = { ...existing, digest: 'sha256:other' };
  const conflict = releaseRoutes();
  conflict.release.assets = [different];
  await assert.rejects(publishRelease({ inputs: releaseInputs(), context, client: releaseRoutes({ releases: [conflict.release] }).client }), (e) => e instanceof PublishError && e.outcome === 'conflict');
  const replace = releaseRoutes();
  replace.release.assets = [different];
  const routes = releaseRoutes({ releases: [replace.release] });
  const r2 = await publishRelease({ inputs: releaseInputs({ replaceAssets: true }), context, client: routes.client });
  assert.equal(r2.outcome, 'replaced');
  assert.equal(routes.uploaded[0].name, `document-design-release-v1.1.0.html.new-${RUN}`);
  assert.deepEqual(routes.deleted, ['300']);
  assert.equal(r2.assetName, 'document-design-release-v1.1.0.html');
});

test('published immutable releases are refused and the artifact link stays', async () => {
  const immutable = releaseRoutes();
  const release = { ...immutable.release, draft: false, immutable: true };
  await assert.rejects(publishRelease({ inputs: releaseInputs(), context, client: releaseRoutes({ releases: [release] }).client }), (e) => e instanceof PublishError && e.outcome === 'immutable' && /artifact remains available/.test(e.message));
});

test('a failed generation cannot be attached', async () => {
  await assert.rejects(publishRelease({ inputs: releaseInputs({ generationResult: 'failure' }), context, client: releaseRoutes().client }), /no report to attach/);
});

test('an HTML artifact whose digest differs from the manifest is refused', async () => {
  const routes = releaseRoutes({ extra: { [`GET /repos/${REPO}/actions/artifacts/5/zip`]: makeZip('r.html', 'tampered') } });
  await assert.rejects(publishRelease({ inputs: releaseInputs({ createDraft: true }), context, client: routes.client }), /digest .* does not match/);
});
