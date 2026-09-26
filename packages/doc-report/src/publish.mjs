// Publishing: an updatable pull request comment, or a release asset. No
// model runs here and no repository code is executed. The source run, its
// artifacts and the pull request or release are read from the API, and the
// manifest inside the artifact is checked against them before anything is
// written.
import { createHash } from 'node:crypto';
import { GitHubError } from './github.mjs';
import { isOurComment, marker, parseCommentMeta, prCommentBody, releaseBlock, upsertReleaseBlock } from './summary.mjs';
import { isZip, readZipEntries } from './zip.mjs';
import { FILE_PREFIX, REPORT_ID_PATTERN } from './version.mjs';

export class PublishError extends Error {
  constructor(message, { outcome = 'failed' } = {}) {
    super(message);
    this.name = 'PublishError';
    this.outcome = outcome;
  }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function artifactPattern(reportId, runId) {
  if (!REPORT_ID_PATTERN.test(reportId)) throw new PublishError(`invalid report id ${reportId}`);
  return new RegExp(`^${escapeRe(FILE_PREFIX)}-${escapeRe(reportId)}-([0-9a-f]{7})-${escapeRe(String(runId))}-(\\d+)\\.(html|manifest\\.json)$`);
}

// The newest attempt's HTML and manifest artifacts for a report id.
export function selectArtifacts(artifacts, reportId, runId) {
  const pattern = artifactPattern(reportId, runId);
  const found = { html: null, manifest: null };
  for (const artifact of artifacts) {
    const m = pattern.exec(artifact.name);
    if (!m) continue;
    const kind = m[3] === 'html' ? 'html' : 'manifest';
    const attempt = Number(m[2]);
    if (!found[kind] || attempt > found[kind].attempt || (attempt === found[kind].attempt && artifact.id > found[kind].id)) {
      found[kind] = { ...artifact, attempt, headShort: m[1] };
    }
  }
  return found;
}

async function loadRun({ client, repository, runId }) {
  let run;
  try {
    run = await client.request('GET', `/repos/${repository}/actions/runs/${runId}`);
  } catch (error) {
    throw new PublishError(`Cannot read workflow run ${runId}: ${error.message}. The publish job needs actions: read.`);
  }
  if (String(run.repository?.full_name ?? '').toLowerCase() !== repository.toLowerCase()) {
    throw new PublishError(`Run ${runId} belongs to ${run.repository?.full_name ?? 'another repository'}, not ${repository}.`);
  }
  return run;
}

async function loadArtifacts({ client, repository, runId, reportId }) {
  const artifacts = await client.paginate(`/repos/${repository}/actions/runs/${runId}/artifacts?per_page=100`, { limit: 1000 });
  const selected = selectArtifacts(artifacts, reportId, runId);
  for (const kind of ['html', 'manifest']) if (selected[kind]?.expired) throw new PublishError(`The ${kind} artifact ${selected[kind].name} has expired.`);
  return selected;
}

async function downloadArtifact({ client, repository, artifact }) {
  const data = await client.request('GET', `/repos/${repository}/actions/artifacts/${artifact.id}/zip`, { raw: true });
  if (isZip(data)) {
    const entries = readZipEntries(data).filter((e) => !e.name.endsWith('/'));
    if (entries.length !== 1) throw new PublishError(`Artifact ${artifact.name} contains ${entries.length} files; expected one.`);
    return entries[0].data;
  }
  return data;
}

function parseManifest(buffer, { reportId, runId, repository, artifactId }) {
  let manifest;
  try {
    manifest = JSON.parse(buffer.toString('utf8'));
  } catch (error) {
    throw new PublishError(`The manifest artifact is not JSON: ${error.message}`);
  }
  const problems = [];
  if (manifest.schema !== 1) problems.push(`schema ${manifest.schema}`);
  if (manifest.reportId !== reportId) problems.push(`report id ${manifest.reportId} ≠ ${reportId}`);
  if (String(manifest.run?.id) !== String(runId)) problems.push(`run ${manifest.run?.id} ≠ ${runId}`);
  if (String(manifest.repository ?? '').toLowerCase() !== repository.toLowerCase()) problems.push(`repository ${manifest.repository} ≠ ${repository}`);
  if (artifactId && manifest.artifact?.id && String(manifest.artifact.id) !== String(artifactId)) problems.push(`html artifact ${manifest.artifact.id} ≠ ${artifactId}`);
  if (!/^[0-9a-f]{40}$/.test(manifest.head?.sha ?? '')) problems.push('head sha missing');
  if (problems.length) throw new PublishError(`The manifest does not match the source run: ${problems.join('; ')}.`);
  return manifest;
}

export function artifactUrl({ serverUrl, repository, runId, artifactId }) {
  return `${serverUrl}/${repository}/actions/runs/${runId}/artifacts/${artifactId}`;
}

// ---- pull request ----

export async function publishPullRequest({ inputs, context, client, log = () => {} }) {
  const repository = context.repository;
  if (!repository) throw new PublishError('GITHUB_REPOSITORY is not set.');
  const run = await loadRun({ client, repository, runId: inputs.sourceRunId });
  const prNumber = inputs.prNumber ?? context.event?.pull_request?.number ?? run.pull_requests?.[0]?.number ?? null;
  if (!prNumber) throw new PublishError('No pull request number: pass pr-number.');
  if (Array.isArray(run.pull_requests) && run.pull_requests.length && !run.pull_requests.some((p) => p.number === prNumber)) {
    throw new PublishError(`Run ${run.id} is not associated with pull request #${prNumber}.`);
  }
  const pr = await client.request('GET', `/repos/${repository}/pulls/${prNumber}`);
  const runHead = run.head_sha;
  const language = inputs.language ?? 'en';

  if (pr.head.sha !== runHead) {
    log(`Pull request #${prNumber} has moved to ${pr.head.sha}; run ${run.id} reported ${runHead}. Nothing is posted.`);
    return { outcome: 'superseded', message: `The pull request head is now ${pr.head.sha.slice(0, 12)}; the report for ${String(runHead).slice(0, 12)} is stale and was not posted.`, prNumber };
  }

  const comments = await client.paginate(`/repos/${repository}/issues/${prNumber}/comments?per_page=100`);
  const ours = comments.filter((c) => isOurComment(c.body, inputs.reportId) && String(c.user?.login ?? '').toLowerCase() === inputs.commentAuthor.toLowerCase());
  const existing = ours.length ? ours.reduce((a, b) => (a.id > b.id ? a : b)) : null;
  const oldMeta = existing ? parseCommentMeta(existing.body) : null;
  const runId = Number(run.id);
  const attempt = Number(run.run_attempt ?? 1);

  if (oldMeta && oldMeta.head === runHead && (oldMeta.run > runId || (oldMeta.run === runId && oldMeta.attempt > attempt))) {
    return { outcome: 'skipped', message: `A newer report for ${runHead.slice(0, 12)} (run ${oldMeta.run} attempt ${oldMeta.attempt}) is already posted.`, prNumber, commentUrl: existing.html_url };
  }

  const artifacts = await loadArtifacts({ client, repository, runId, reportId: inputs.reportId });
  let outcome = 'success';
  let meta;
  let previous = null;
  let publishFailure = null;
  const runUrl = run.html_url ?? `${context.serverUrl}/${repository}/actions/runs/${runId}`;

  if (inputs.generationResult === 'skipped' || inputs.generationResult === 'cancelled') {
    return { outcome: 'skipped', message: `The generation job was ${inputs.generationResult}; no comment is posted.`, prNumber };
  }
  if (inputs.generationResult === 'success' && artifacts.html && artifacts.manifest) {
    const manifestBytes = await downloadArtifact({ client, repository, artifact: artifacts.manifest });
    const manifest = parseManifest(manifestBytes, { reportId: inputs.reportId, runId, repository, artifactId: artifacts.html.id });
    if (manifest.head.sha !== runHead) throw new PublishError(`The manifest head ${manifest.head.sha} does not match the run head ${runHead}.`);
    if (manifest.pullRequest && manifest.pullRequest.number !== prNumber) throw new PublishError(`The manifest was generated for pull request #${manifest.pullRequest.number}, not #${prNumber}.`);
    const url = artifactUrl({ serverUrl: context.serverUrl, repository, runId, artifactId: artifacts.html.id });
    meta = { v: 1, repo: repository, pr: prNumber, head: runHead, base: manifest.base?.sha ?? null, run: runId, attempt, status: manifest.status, artifact: artifacts.html.id, url, evidence: manifest.evidence?.digest ?? null, retention: null, run_url: runUrl, generated_at: manifest.generatedAt, outcome: 'success', language: manifest.language ?? language };
    meta.retention = artifacts.html.expires_at ? daysBetween(artifacts.html.created_at, artifacts.html.expires_at) : null;
  } else {
    outcome = 'failure';
    const why = inputs.generationResult !== 'success' ? `generation result: ${inputs.generationResult}` : !artifacts.html ? 'no HTML artifact was uploaded' : 'no manifest artifact was uploaded';
    log(`Posting a failure comment (${why}).`);
    const lastSuccess = oldMeta?.outcome === 'success' ? { url: oldMeta.url, head: oldMeta.head, artifact: oldMeta.artifact } : oldMeta?.last_success ?? null;
    if (lastSuccess?.artifact) {
      try {
        const a = await client.request('GET', `/repos/${repository}/actions/artifacts/${lastSuccess.artifact}`);
        lastSuccess.expired = Boolean(a.expired);
      } catch (error) {
        if (error instanceof GitHubError && error.status === 404) lastSuccess.deleted = true;
      }
    }
    previous = lastSuccess;
    meta = { v: 1, repo: repository, pr: prNumber, head: runHead, run: runId, attempt, outcome: 'failure', reason: why, run_url: runUrl, last_success: lastSuccess, language: oldMeta?.language ?? language };
  }

  const body = prCommentBody({ reportId: inputs.reportId, language: meta.language, meta, outcome, previous });
  // Re-check the head right before writing: the window is small, not zero.
  const fresh = await client.request('GET', `/repos/${repository}/pulls/${prNumber}`);
  if (fresh.head.sha !== runHead) {
    return { outcome: 'superseded', message: `The pull request moved to ${fresh.head.sha.slice(0, 12)} while publishing; nothing was posted.`, prNumber };
  }
  try {
    const comment = existing
      ? await client.request('PATCH', `/repos/${repository}/issues/comments/${existing.id}`, { body: { body } })
      : await client.request('POST', `/repos/${repository}/issues/${prNumber}/comments`, { body: { body } });
    return { outcome: outcome === 'success' ? (existing ? 'updated' : 'posted') : 'failure-posted', message: existing ? `Updated comment ${comment.html_url}` : `Posted comment ${comment.html_url}`, prNumber, commentUrl: comment.html_url, artifactUrl: meta.url ?? null, head: runHead, generationFailed: outcome === 'failure', publishFailure };
  } catch (error) {
    const hint = error instanceof GitHubError && error.status === 403 ? ' The publish job needs pull-requests: write.' : '';
    throw new PublishError(`Could not ${existing ? 'update' : 'post'} the pull request comment: ${error.message}.${hint} The generated artifact is still available in the run.`);
  }
}

function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Number.isFinite(ms) ? Math.round(ms / 86400000) : null;
}

// ---- release ----

export function assetName(reportId, tag) {
  const safe = tag.replace(/[^A-Za-z0-9._-]/g, '-');
  const suffix = safe === tag ? '' : `-${createHash('sha256').update(tag).digest('hex').slice(0, 8)}`;
  return `${FILE_PREFIX}-${reportId}-${safe}${suffix}.html`;
}

async function findRelease({ client, repository, tag }) {
  const releases = await client.paginate(`/repos/${repository}/releases?per_page=100`, { limit: 300 });
  return releases.find((r) => r.tag_name === tag) ?? null;
}

async function tagCommit({ client, repository, tag }) {
  let ref;
  try {
    ref = await client.request('GET', `/repos/${repository}/git/ref/tags/${encodeURIComponent(tag)}`);
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return null;
    throw error;
  }
  if (ref.object?.type === 'tag') {
    const tagObject = await client.request('GET', `/repos/${repository}/git/tags/${ref.object.sha}`);
    return tagObject.object?.sha ?? null;
  }
  return ref.object?.sha ?? null;
}

export async function publishRelease({ inputs, context, client, log = () => {} }) {
  const repository = context.repository;
  if (!repository) throw new PublishError('GITHUB_REPOSITORY is not set.');
  const run = await loadRun({ client, repository, runId: inputs.sourceRunId });
  const runId = Number(run.id);
  if (inputs.generationResult !== 'success') throw new PublishError(`The generation job result is ${inputs.generationResult}; there is no report to attach.`);
  const artifacts = await loadArtifacts({ client, repository, runId, reportId: inputs.reportId });
  if (!artifacts.html || !artifacts.manifest) throw new PublishError(`Run ${runId} has no ${!artifacts.html ? 'HTML' : 'manifest'} artifact for report id ${inputs.reportId}.`);

  const manifest = parseManifest(await downloadArtifact({ client, repository, artifact: artifacts.manifest }), { reportId: inputs.reportId, runId, repository, artifactId: artifacts.html.id });
  const html = await downloadArtifact({ client, repository, artifact: artifacts.html });
  const digest = `sha256:${createHash('sha256').update(html).digest('hex')}`;
  if (manifest.html?.digest && manifest.html.digest !== digest) throw new PublishError(`The HTML artifact digest ${digest} does not match the manifest ${manifest.html.digest}.`);

  const tag = inputs.releaseTag;
  const commit = await tagCommit({ client, repository, tag });
  if (!commit) throw new PublishError(`Tag ${tag} does not exist. The publish action does not create tags.`);
  if (commit !== manifest.head.sha) throw new PublishError(`Tag ${tag} points at ${commit.slice(0, 12)} but the report describes ${manifest.head.sha.slice(0, 12)}.`);

  let release = await findRelease({ client, repository, tag });
  let created = false;
  if (!release) {
    if (!inputs.createDraft) throw new PublishError(`No release exists for ${tag}. Create one first, or set create-draft: true to create a draft.`);
    try {
      release = await client.request('POST', `/repos/${repository}/releases`, { body: { tag_name: tag, name: tag, draft: true, body: '' } });
      created = true;
      log(`Created draft release for ${tag}`);
    } catch (error) {
      const hint = error instanceof GitHubError && error.status === 403 ? ' The attach job needs contents: write.' : '';
      throw new PublishError(`Could not create a draft release for ${tag}: ${error.message}.${hint}`);
    }
  }
  if (release.immutable && !release.draft) {
    throw new PublishError(`Release ${tag} is published and immutable; assets cannot be added after publication. Attach the report while the release is a draft. The HTML artifact remains available in the workflow run.`, { outcome: 'immutable' });
  }

  const name = assetName(inputs.reportId, tag);
  const existing = (release.assets ?? []).find((a) => a.name === name);
  let asset = null;
  let reused = false;
  if (existing) {
    let existingDigest = existing.digest ?? null;
    if (!existingDigest) {
      const bytes = await client.request('GET', `/repos/${repository}/releases/assets/${existing.id}`, { raw: true, accept: 'application/octet-stream' });
      existingDigest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
    }
    if (existingDigest === digest) {
      asset = existing;
      reused = true;
      log(`Asset ${name} already carries this report; reusing it.`);
    } else if (!inputs.replaceAssets) {
      throw new PublishError(`Asset ${name} exists on ${tag} with different content (${existingDigest}). Set replace-assets: true on a draft or mutable release to replace it.`, { outcome: 'conflict' });
    } else if (release.immutable) {
      throw new PublishError(`Asset ${name} differs and the release is immutable; it cannot be replaced.`, { outcome: 'immutable' });
    }
  }

  const uploadUrl = String(release.upload_url ?? '').replace(/\{[^}]*\}$/, '');
  if (!asset) {
    const tempName = existing ? `${name}.new-${runId}` : name;
    let uploaded;
    try {
      uploaded = await client.request('POST', `${uploadUrl}?name=${encodeURIComponent(tempName)}`, { body: html, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch (error) {
      const hint = error instanceof GitHubError && error.status === 403 ? ' The attach job needs contents: write.' : '';
      throw new PublishError(`Uploading ${tempName} to ${tag} failed: ${error.message}.${hint}`);
    }
    if (existing) {
      try {
        await client.request('DELETE', `/repos/${repository}/releases/assets/${existing.id}`);
        uploaded = await client.request('PATCH', `/repos/${repository}/releases/assets/${uploaded.id}`, { body: { name } });
      } catch (error) {
        throw new PublishError(`Replaced asset upload succeeded as ${tempName}, but swapping it in failed: ${error.message}. Remove the old asset and rename ${tempName} manually.`);
      }
    }
    asset = uploaded;
  }

  let bodyUpdated = false;
  if (inputs.updateReleaseBody) {
    const block = releaseBlock({ reportId: inputs.reportId, language: manifest.language ?? 'en', assetUrl: asset.browser_download_url, artifactUrl: artifactUrl({ serverUrl: context.serverUrl, repository, runId, artifactId: artifacts.html.id }), baseSha: manifest.base?.sha ?? null, headSha: manifest.head.sha, status: manifest.status, runUrl: run.html_url ?? null });
    const body = upsertReleaseBlock(release.body ?? '', block, inputs.reportId);
    if (body !== (release.body ?? '')) {
      await client.request('PATCH', `/repos/${repository}/releases/${release.id}`, { body: { body } });
      bodyUpdated = true;
    }
  }
  return { outcome: reused ? 'reused' : existing ? 'replaced' : 'attached', message: `${reused ? 'Reused' : 'Attached'} ${name} on ${release.draft ? 'draft ' : ''}release ${tag}`, assetUrl: asset.browser_download_url, assetName: name, releaseUrl: release.html_url, draft: Boolean(release.draft), created, bodyUpdated, head: manifest.head.sha, status: manifest.status };
}

export { marker };
