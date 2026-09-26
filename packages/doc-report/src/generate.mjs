// One report, end to end: resolve the revisions, collect the evidence, ask
// the model, render, validate, write. Returns a state object; it never
// throws for a report that could not be made, so the calling step can
// record the outcome and the finishing step can fail the job deliberately.
import { execFile } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { runUrl } from './context.mjs';
import { CopilotError, ensureCli, runCopilot } from './copilot.mjs';
import { collectEvidence, evidenceIndex } from './evidence.mjs';
import { createGit } from './git.mjs';
import { createClient } from './github.mjs';
import { buildManifest, sha256 } from './manifest.mjs';
import { readStylesheet, readStylesheetVersion } from './paths.mjs';
import { buildPrompt, PROMPT_VERSION } from './prompt.mjs';
import { LABELS, renderReport } from './render.mjs';
import { RevisionError, attachTrees, resolveRevision } from './revisions.mjs';
import { ReportValidationError, extractJson, validateReport } from './schema.mjs';
import { validateHtml } from './validate.mjs';
import { FILE_PREFIX } from './version.mjs';

const run = promisify(execFile);

export async function actionRevision(context) {
  if (context.actionPath) {
    try {
      const { stdout } = await run('git', ['-C', context.actionPath, 'rev-parse', 'HEAD'], { env: { PATH: process.env.PATH, HOME: process.env.HOME, GIT_TERMINAL_PROMPT: '0' } });
      if (/^[0-9a-f]{40}$/.test(stdout.trim())) return stdout.trim();
    } catch {}
  }
  return context.actionRef || null;
}

export function defaultTitle({ language, context, revision }) {
  const L = LABELS[language] ?? LABELS.en;
  const parts = [L.eyebrow];
  if (context.repository) parts.push(context.repository);
  if (revision?.pr) parts.push(`#${revision.pr.number}`);
  else if (revision?.release) parts.push(revision.release.tag);
  else if (revision) parts.push(`${revision.base.sha ? revision.base.sha.slice(0, 7) : L.emptyTree} → ${revision.head.sha.slice(0, 7)}`);
  return parts.join(' · ');
}

export function fileNames({ reportId, headSha, context }) {
  const stem = `${FILE_PREFIX}-${reportId}-${headSha.slice(0, 7)}-${context.runId || 'local'}-${context.runAttempt || '1'}`;
  return { html: `${stem}.html`, manifest: `${stem}.manifest.json` };
}

export async function generate({ inputs, context, env = process.env, log = console.error, now = () => new Date() }) {
  const state = { status: 'failed', reason: null, reportId: inputs.reportId, language: inputs.language, mode: inputs.mode, runUrl: runUrl(context), retentionDays: inputs.retentionDays, upload: false, notes: [] };
  const stateDir = context.stateDir || join(context.runnerTemp || process.cwd(), 'document-design-report', inputs.reportId);
  const outDir = join(stateDir, 'out');
  mkdirSync(outDir, { recursive: true });
  state.stateDir = stateDir;

  const git = createGit(inputs.repositoryPath, { env });
  let revision = null;
  let evidence = null;
  try {
    await git.toplevel();
  } catch (error) {
    return fail(state, `repository-path ${inputs.repositoryPath} is not a git work tree: ${error.message}`);
  }

  try {
    revision = await resolveRevision({ inputs, context, git });
    await attachTrees(git, revision);
  } catch (error) {
    if (error instanceof RevisionError && error.skip) return skip(state, error.reason, error.message);
    return fail(state, error.message);
  }
  Object.assign(state, describe(revision));
  state.notes = [...revision.notes];

  if (revision.pr?.fork) return skip(state, 'fork', 'Pull requests from forks are not reported by default; the head code and the token come from different trust domains.');

  const css = readStylesheet();
  const docUi = readStylesheetVersion();
  const generatedAt = now().toISOString();
  const revisionSha = await actionRevision(context);
  const title = inputs.title ?? defaultTitle({ language: inputs.language, context, revision });
  const provenanceBase = { serverUrl: context.serverUrl, repository: context.repository || null, runUrl: state.runUrl, generatedAt, actionRevision: revisionSha, docUiVersion: docUi.version, pullRequest: revision.pr?.number ?? null, releaseTag: revision.release?.tag ?? null, promptVersion: PROMPT_VERSION };

  let report = null;
  let generation = null;
  let status;
  if (revision.sameTree) {
    state.hasChanges = false;
    if (inputs.onEmpty === 'skip') return skip(state, 'no-changes', 'The base and head trees are identical.');
    evidence = await collectEvidence({ git, revision, budget: inputs.maxInputBytes, context, log });
    status = 'empty';
  } else {
    state.hasChanges = true;
    const github = revision.pr ? createClient({ token: inputs.token, apiUrl: context.apiUrl }) : null;
    try {
      evidence = await collectEvidence({ git, revision, budget: inputs.maxInputBytes, github, context, log });
    } catch (error) {
      return fail(state, `Collecting evidence failed: ${error.message}`);
    }
    state.evidenceDigest = evidence.digest;
    try {
      ({ report, generation } = await askModel({ inputs, evidence, stateDir, env, log }));
    } catch (error) {
      state.diagnostics = error.stderr ? String(error.stderr).slice(-4000) : undefined;
      return fail(state, error.message);
    }
    status = evidence.partial ? 'partial' : 'complete';
  }

  const html = renderReport({ report, evidence, provenance: { ...provenanceBase, status, model: generation ? { requested: generation.model, used: generation.modelsUsed } : null, cliVersion: generation?.cliVersion ?? null }, language: inputs.language, title, css });
  const check = validateHtml(html);
  if (!check.ok) return fail(state, `The rendered HTML failed validation and was not uploaded: ${check.problems.slice(0, 5).join('; ')}`);

  const files = fileNames({ reportId: inputs.reportId, headSha: revision.head.sha, context });
  const reportPath = join(outDir, files.html);
  const manifestPath = join(outDir, files.manifest);
  writeFileSync(reportPath, html);
  const manifest = buildManifest({ context, inputs, revision, evidence, status, html, generation, generatedAt, actionRevision: revisionSha, docUi, files });
  manifest.run.url = state.runUrl;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  Object.assign(state, { status, reason: null, upload: true, reportPath, manifestPath, htmlDigest: sha256(html), evidenceDigest: evidence.digest, files, generatedAt });
  return state;
}

function describe(revision) {
  return {
    mode: revision.mode, rule: revision.rule,
    baseRef: revision.base.ref, baseSha: revision.base.sha, baseTree: revision.base.tree,
    headRef: revision.head.ref, headSha: revision.head.sha, headTree: revision.head.tree ?? null,
    prNumber: revision.pr?.number ?? null, releaseTag: revision.release?.tag ?? null,
  };
}

function fail(state, reason) {
  return Object.assign(state, { status: 'failed', reason, upload: false });
}

function skip(state, reason, message) {
  return Object.assign(state, { status: 'skipped', reason: message, skipKind: reason, upload: false, hasChanges: state.hasChanges ?? null });
}

// Ask, check, and ask again at most `maxAttempts` times in total, all
// within one deadline. Authentication, access and quota errors are not
// retried: the second attempt would fail the same way and cost the same.
async function askModel({ inputs, evidence, stateDir, env, log }) {
  const deadline = Date.now() + inputs.timeoutSeconds * 1000;
  const index = evidenceIndex(evidence);
  const cli = await ensureCli({ prefix: join(stateDir, 'copilot'), env, log });
  let repair = null;
  let lastError = null;
  let elapsed = 0;
  const modelsUsed = new Set();
  let usage = null;
  for (let attempt = 1; attempt <= inputs.maxAttempts; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining < 1000) break;
    const prompt = buildPrompt({ evidence, language: inputs.language, title: inputs.title, instructions: inputs.instructions, repair });
    const workRoot = join(stateDir, `attempt-${attempt}`);
    log(`Generating with Copilot CLI (attempt ${attempt} of ${inputs.maxAttempts}, model ${inputs.model}, prompt ${Buffer.byteLength(prompt.text, 'utf8')} bytes)`);
    let result;
    try {
      result = await runCopilot({ prompt: prompt.text, model: inputs.model, token: inputs.token, workRoot, timeoutMs: remaining, cli, env, log });
    } catch (error) {
      lastError = error;
      if (error instanceof CopilotError && ['auth', 'access', 'quota', 'install', 'timeout'].includes(error.kind)) throw error;
      log(`Attempt ${attempt} failed: ${error.message}`);
      continue;
    }
    elapsed += result.elapsedMs;
    if (result.usage) { usage = result.usage; for (const m of result.usage.models) modelsUsed.add(m); }
    try {
      const report = validateReport(extractJson(result.text), index);
      return { report, generation: { promptVersion: prompt.version, model: inputs.model, modelsUsed: [...modelsUsed], usage, cliVersion: cli.version, attempts: attempt, elapsedMs: elapsed, llm: 'github-copilot-cli' } };
    } catch (error) {
      if (!(error instanceof ReportValidationError)) throw error;
      lastError = error;
      log(`Attempt ${attempt} produced an invalid report: ${error.errors.slice(0, 3).join('; ')}`);
      repair = { errors: error.errors.slice(0, 20), previous: result.text };
    }
  }
  const reason = lastError instanceof ReportValidationError ? `The model did not return a valid report after ${inputs.maxAttempts} attempt(s): ${lastError.errors.slice(0, 3).join('; ')}` : lastError?.message ?? `No attempt could run within ${inputs.timeoutSeconds}s`;
  throw Object.assign(new Error(reason), { stderr: lastError?.stderr });
}
