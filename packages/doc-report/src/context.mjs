// The GitHub Actions run this code is part of. Read from the environment and
// the event payload file; nothing here is interpolated into a shell.
import { appendFileSync, readFileSync } from 'node:fs';

export function readContext(env = process.env) {
  let event = null;
  if (env.GITHUB_EVENT_PATH) {
    try {
      event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    } catch (error) {
      throw new Error(`Cannot read the event payload at ${env.GITHUB_EVENT_PATH}: ${error.message}`);
    }
  }
  const repository = env.GITHUB_REPOSITORY || '';
  if (repository && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error(`Unexpected GITHUB_REPOSITORY: ${repository}`);
  }
  return {
    repository,
    serverUrl: (env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, ''),
    apiUrl: (env.GITHUB_API_URL || 'https://api.github.com').replace(/\/$/, ''),
    eventName: env.GITHUB_EVENT_NAME || '',
    event,
    ref: env.GITHUB_REF || '',
    sha: env.GITHUB_SHA || '',
    runId: env.GITHUB_RUN_ID || '',
    runAttempt: env.GITHUB_RUN_ATTEMPT || '1',
    workflow: env.GITHUB_WORKFLOW || '',
    job: env.GITHUB_JOB || '',
    actionRef: env.GITHUB_ACTION_REF || '',
    actionRepository: env.GITHUB_ACTION_REPOSITORY || '',
    actionPath: env.DD_REPORT_ACTION_PATH || env.GITHUB_ACTION_PATH || '',
    runnerTemp: env.RUNNER_TEMP || '',
    stateDir: env.DD_REPORT_STATE_DIR || '',
    outputFile: env.GITHUB_OUTPUT || '',
    summaryFile: env.GITHUB_STEP_SUMMARY || '',
  };
}

export function runUrl(context) {
  if (!context.repository || !context.runId) return null;
  const attempt = context.runAttempt && context.runAttempt !== '1' ? `/attempts/${context.runAttempt}` : '';
  return `${context.serverUrl}/${context.repository}/actions/runs/${context.runId}${attempt}`;
}

// Multi-line values use the heredoc form GitHub documents for GITHUB_OUTPUT.
export function writeOutputs(file, outputs) {
  if (!file) return;
  const lines = [];
  for (const [key, value] of Object.entries(outputs)) {
    if (value === undefined || value === null) continue;
    const text = String(value);
    if (text.includes('\n')) {
      const delimiter = `ddEOF${Math.random().toString(36).slice(2)}`;
      lines.push(`${key}<<${delimiter}`, text, delimiter);
    } else {
      lines.push(`${key}=${text}`);
    }
  }
  if (lines.length) appendFileSync(file, lines.join('\n') + '\n');
}

export function appendSummary(file, markdown) {
  if (!file || !markdown) return;
  appendFileSync(file, markdown.endsWith('\n') ? markdown : markdown + '\n');
}
