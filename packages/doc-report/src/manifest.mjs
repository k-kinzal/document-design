// The manifest: what was compared, by which rule, with which generator, and
// what came out. It is a record, not an attestation; nothing signs it.
import { createHash } from 'node:crypto';
import { ACTION_NAME, ACTION_VERSION, MANIFEST_SCHEMA } from './version.mjs';

export const sha256 = (data) => `sha256:${createHash('sha256').update(data).digest('hex')}`;

export function buildManifest({ context, inputs, revision, evidence, status, html, generation, artifact = null, manifestArtifact = null, generatedAt, actionRevision, docUi, files }) {
  return {
    schema: MANIFEST_SCHEMA,
    generator: { name: ACTION_NAME, version: ACTION_VERSION, revision: actionRevision ?? null, ref: context.actionRef || null, repository: context.actionRepository || null },
    repository: context.repository || null,
    reportId: inputs.reportId,
    mode: revision?.mode ?? inputs.mode,
    rule: revision?.rule ?? null,
    language: inputs.language,
    pullRequest: revision?.pr ? { number: revision.pr.number, targetBaseSha: revision.pr.targetBaseSha, headRef: revision.pr.headRef, baseRef: revision.pr.baseRef } : null,
    release: revision?.release ?? null,
    input: { base: inputs.base, head: inputs.head, prNumber: inputs.prNumber, model: inputs.model, maxInputBytes: inputs.maxInputBytes, maxAttempts: inputs.maxAttempts, timeoutSeconds: inputs.timeoutSeconds, onEmpty: inputs.onEmpty, hasInstructions: Boolean(inputs.instructions) },
    base: revision ? { ref: revision.base.ref, sha: revision.base.sha, tree: revision.base.tree } : null,
    head: revision ? { ref: revision.head.ref, sha: revision.head.sha, tree: revision.head.tree ?? null } : null,
    notes: revision?.notes ?? [],
    status,
    evidence: evidence ? { digest: evidence.digest, files: evidence.filesTotal, commits: evidence.commitsTotal, budget: evidence.budget, omissions: evidence.omissions, partial: evidence.partial } : null,
    generation: generation ? { promptVersion: generation.promptVersion, model: generation.model, modelsUsed: generation.modelsUsed ?? [], usage: generation.usage ?? null, cliVersion: generation.cliVersion ?? null, attempts: generation.attempts, elapsedMs: generation.elapsedMs ?? null, llm: generation.llm } : null,
    docUi: docUi ?? null,
    html: html ? { digest: sha256(html), bytes: Buffer.byteLength(html, 'utf8'), file: files?.html ?? null } : null,
    artifact,
    manifestArtifact,
    run: { id: context.runId || null, attempt: Number(context.runAttempt) || 1, workflow: context.workflow || null, event: context.eventName || null, url: null },
    generatedAt,
  };
}
