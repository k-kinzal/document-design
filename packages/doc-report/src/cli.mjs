// Entry point for the composite actions. Each subcommand is one step; state
// crosses steps through a JSON file in the step's state directory, and the
// finishing step decides the exit code from that file so a failed
// generation still records its outputs and summary.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { appendSummary, readContext, runUrl, writeOutputs } from './context.mjs';
import { generate } from './generate.mjs';
import { createClient } from './github.mjs';
import { InputError, parseGenerateInputs, parsePublishInputs, readEnv } from './inputs.mjs';
import { PublishError, publishPullRequest, publishRelease } from './publish.mjs';
import { jobSummary, t } from './summary.mjs';
import { ACTION_NAME, ACTION_VERSION } from './version.mjs';

const log = (message) => process.stderr.write(`${message}\n`);

function stateFile(context) {
  const dir = context.stateDir || join(context.runnerTemp || process.cwd(), 'document-design-report', 'default');
  mkdirSync(dir, { recursive: true });
  return join(dir, 'state.json');
}

function readState(context) {
  const file = stateFile(context);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeState(context, state) {
  writeFileSync(stateFile(context), JSON.stringify(state, null, 2) + '\n');
}

function publicOutputs(state, extra = {}) {
  return {
    status: state.status,
    'has-changes': state.hasChanges === true ? 'true' : state.hasChanges === false ? 'false' : '',
    'report-path': state.reportPath ?? '',
    'manifest-path': state.manifestPath ?? '',
    'artifact-id': state.artifact?.id ?? '',
    'artifact-url': state.artifact?.url ?? '',
    'manifest-artifact-id': state.manifestArtifact?.id ?? '',
    'base-ref': state.baseRef ?? '',
    'head-ref': state.headRef ?? '',
    'base-sha': state.baseSha ?? '',
    'head-sha': state.headSha ?? '',
    'base-tree': state.baseTree ?? '',
    'run-url': state.runUrl ?? '',
    reason: state.reason ?? '',
    ...extra,
  };
}

async function commandGenerate({ defaultMode, defaultReportId }) {
  const context = readContext();
  let state;
  try {
    const inputs = parseGenerateInputs(readEnv(), { defaultMode, defaultReportId });
    log(`${ACTION_NAME} ${ACTION_VERSION}: mode ${inputs.mode}, report id ${inputs.reportId}, language ${inputs.language}`);
    state = await generate({ inputs, context, log });
  } catch (error) {
    state = { status: 'failed', reason: error instanceof InputError ? error.message : `Unexpected error: ${error.message}`, upload: false, runUrl: runUrl(context), language: 'en' };
    if (!(error instanceof InputError)) log(error.stack ?? String(error));
  }
  writeState(context, state);
  writeOutputs(context.outputFile, { upload: state.upload ? 'true' : 'false', 'report-path': state.reportPath ?? '', 'manifest-path': state.manifestPath ?? '' });
  log(`Generation ${state.status}${state.reason ? `: ${state.reason}` : ''}`);
}

function commandManifest() {
  const context = readContext();
  const state = readState(context);
  if (!state || !state.upload) return;
  const env = process.env;
  state.artifact = { id: env.DD_ARTIFACT_ID ? Number(env.DD_ARTIFACT_ID) : null, url: env.DD_ARTIFACT_URL || null, digest: env.DD_ARTIFACT_DIGEST || null };
  if (!state.artifact.id || !state.artifact.url) {
    state.status = 'failed';
    state.reason = 'The HTML artifact upload did not return an artifact id and URL.';
    state.upload = false;
  } else if (state.manifestPath) {
    const manifest = JSON.parse(readFileSync(state.manifestPath, 'utf8'));
    manifest.artifact = { id: state.artifact.id, url: state.artifact.url, digest: state.artifact.digest, name: state.files?.html ?? null, retentionDays: state.retentionDays };
    writeFileSync(state.manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
  writeState(context, state);
  writeOutputs(context.outputFile, { 'manifest-path': state.manifestPath ?? '', upload: state.upload ? 'true' : 'false' });
}

function commandFinish() {
  const context = readContext();
  const state = readState(context) ?? { status: 'failed', reason: 'The generation step did not record a result.', runUrl: runUrl(context), language: 'en' };
  const env = process.env;
  if (state.upload) {
    state.manifestArtifact = { id: env.DD_MANIFEST_ARTIFACT_ID ? Number(env.DD_MANIFEST_ARTIFACT_ID) : null, url: env.DD_MANIFEST_ARTIFACT_URL || null };
    if (!state.artifact?.id) { state.status = 'failed'; state.reason = state.reason ?? 'The HTML artifact was not uploaded.'; }
    else if (!state.manifestArtifact.id) { state.status = 'failed'; state.reason = 'The manifest artifact was not uploaded.'; }
  }
  state.artifactUrl = state.artifact?.url ?? null;
  writeState(context, state);
  writeOutputs(context.outputFile, publicOutputs(state));
  appendSummary(context.summaryFile, jobSummary(state, state.language ?? 'en'));
  if (state.status === 'failed') {
    log(`::error::${state.reason ?? 'report generation failed'}`);
    process.exitCode = 1;
  } else {
    log(`Report ${state.status}${state.artifactUrl ? `: ${state.artifactUrl}` : ''}`);
  }
}

async function commandPublish() {
  const context = readContext();
  let inputs;
  try {
    inputs = parsePublishInputs(readEnv());
  } catch (error) {
    log(`::error::${error.message}`);
    process.exitCode = 1;
    return;
  }
  const client = createClient({ token: inputs.token, apiUrl: context.apiUrl });
  let result;
  try {
    result = inputs.target === 'pr' ? await publishPullRequest({ inputs, context, client, log }) : await publishRelease({ inputs, context, client, log });
  } catch (error) {
    const message = error instanceof PublishError ? error.message : `Unexpected error: ${error.message}`;
    if (!(error instanceof PublishError)) log(error.stack ?? String(error));
    result = { outcome: error.outcome ?? 'failed', message };
  }
  const T = t('en');
  const lines = [`## ${T.title}: publish (${inputs.reportId})`, '', `Outcome: **${result.outcome}**`, '', result.message];
  if (result.commentUrl) lines.push('', `Comment: ${result.commentUrl}`);
  if (result.assetUrl) lines.push('', `Asset: ${result.assetUrl}`);
  if (result.releaseUrl) lines.push(`Release: ${result.releaseUrl}`);
  appendSummary(context.summaryFile, lines.join('\n') + '\n');
  writeOutputs(context.outputFile, { outcome: result.outcome, 'comment-url': result.commentUrl ?? '', 'asset-url': result.assetUrl ?? '', 'release-url': result.releaseUrl ?? '', message: result.message ?? '' });
  const failed = ['failed', 'conflict', 'immutable'].includes(result.outcome) || (result.outcome === 'failure-posted' && inputs.generationResult === 'success');
  if (failed) { log(`::error::${result.message}`); process.exitCode = 1; }
  else log(`${result.outcome}: ${result.message}`);
}

const [command, ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(rest.map((arg) => { const m = /^--([^=]+)=(.*)$/.exec(arg); return m ? [m[1], m[2]] : [arg, true]; }));

try {
  switch (command) {
    case 'generate': await commandGenerate({ defaultMode: flags.mode ?? 'auto', defaultReportId: flags['report-id'] ?? 'default' }); break;
    case 'manifest': commandManifest(); break;
    case 'finish': commandFinish(); break;
    case 'publish': await commandPublish(); break;
    case 'version': process.stdout.write(`${ACTION_NAME} ${ACTION_VERSION}\n`); break;
    default:
      log(`Usage: report.mjs <generate|manifest|finish|publish|version>`);
      process.exitCode = 2;
  }
} catch (error) {
  log(`::error::${error.message}`);
  log(error.stack ?? '');
  process.exitCode = 1;
}
