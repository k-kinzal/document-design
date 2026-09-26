// Action inputs, read once and rejected early. Every value arrives as a
// string from the workflow; nothing below trusts a value it has not checked.
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_MODEL, REPORT_ID_PATTERN } from './version.mjs';

export class InputError extends Error {
  constructor(name, message) {
    super(`Invalid input \`${name}\`: ${message}`);
    this.name = 'InputError';
    this.input = name;
  }
}

const MODES = ['auto', 'push', 'pr', 'range', 'release'];
const LANGUAGES = ['en', 'ja'];
const ON_EMPTY = ['report', 'skip'];
const BASE_STRATEGIES = ['previous-stable'];
const INITIAL_RELEASE = ['full', 'error'];
const PUBLISH_TARGETS = ['pr', 'release'];
const GENERATION_RESULTS = ['success', 'failure', 'cancelled', 'skipped'];

// A git ref the action will pass to git. Refs are validated here and passed
// to git after `--end-of-options`, so a value can never be read as a flag.
const REF = /^[A-Za-z0-9][A-Za-z0-9._\/+-]{0,255}$/;
const CONTROL = /[\u0000-\u001f\u007f]/;

function text(raw, name, { max, allowEmpty = true }) {
  const value = String(raw ?? '').trim();
  if (CONTROL.test(value)) throw new InputError(name, 'control characters are not allowed');
  if (value.length > max) throw new InputError(name, `longer than ${max} characters`);
  if (!value && !allowEmpty) throw new InputError(name, 'a value is required');
  return value;
}

function ref(raw, name) {
  const value = text(raw, name, { max: 256 });
  if (!value) return null;
  if (!REF.test(value) || value.includes('..') || value.endsWith('.lock') || value.includes('@{')) {
    throw new InputError(name, `not a safe git ref: ${JSON.stringify(value)}`);
  }
  return value;
}

function oneOf(raw, name, allowed, fallback) {
  const value = String(raw ?? '').trim() || fallback;
  if (!allowed.includes(value)) throw new InputError(name, `expected one of ${allowed.join(', ')}; got ${JSON.stringify(value)}`);
  return value;
}

function integer(raw, name, { min, max, fallback }) {
  const value = String(raw ?? '').trim();
  if (!value) return fallback;
  if (!/^\d{1,9}$/.test(value)) throw new InputError(name, `expected a whole number; got ${JSON.stringify(value)}`);
  const n = Number(value);
  if (n < min || n > max) throw new InputError(name, `expected ${min}..${max}; got ${n}`);
  return n;
}

function boolean(raw, name, fallback) {
  const value = String(raw ?? '').trim().toLowerCase();
  if (!value) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new InputError(name, `expected true or false; got ${JSON.stringify(value)}`);
}

// Environment names are fixed by action.yml; composite actions do not
// export INPUT_* automatically, so the mapping is explicit.
export function readEnv(env = process.env) {
  const get = (key) => env[`DD_INPUT_${key}`];
  return {
    'github-token': get('GITHUB_TOKEN'),
    'repository-path': get('REPOSITORY_PATH'),
    mode: get('MODE'),
    base: get('BASE'),
    head: get('HEAD'),
    'pr-number': get('PR_NUMBER'),
    language: get('LANGUAGE'),
    title: get('TITLE'),
    instructions: get('INSTRUCTIONS'),
    model: get('MODEL'),
    'report-id': get('REPORT_ID'),
    'retention-days': get('RETENTION_DAYS'),
    'timeout-seconds': get('TIMEOUT_SECONDS'),
    'max-input-bytes': get('MAX_INPUT_BYTES'),
    'max-attempts': get('MAX_ATTEMPTS'),
    'on-empty': get('ON_EMPTY'),
    'base-strategy': get('BASE_STRATEGY'),
    'initial-release': get('INITIAL_RELEASE'),
    target: get('TARGET'),
    'source-run-id': get('SOURCE_RUN_ID'),
    'generation-result': get('GENERATION_RESULT'),
    'release-tag': get('RELEASE_TAG'),
    'create-draft': get('CREATE_DRAFT'),
    'update-release-body': get('UPDATE_RELEASE_BODY'),
    'replace-assets': get('REPLACE_ASSETS'),
    'comment-author': get('COMMENT_AUTHOR'),
  };
}

export function parseGenerateInputs(raw, { defaultMode = 'auto', defaultReportId = 'default', cwd = process.cwd() } = {}) {
  const token = String(raw['github-token'] ?? '');
  if (!token.trim()) throw new InputError('github-token', 'a token is required');

  const repositoryPath = resolve(cwd, text(raw['repository-path'], 'repository-path', { max: 4096 }) || '.');
  if (!existsSync(repositoryPath) || !statSync(repositoryPath).isDirectory()) {
    throw new InputError('repository-path', `not a directory: ${repositoryPath}`);
  }

  const mode = oneOf(raw.mode, 'mode', MODES, defaultMode);
  const inputs = {
    token,
    repositoryPath,
    mode,
    base: ref(raw.base, 'base'),
    head: ref(raw.head, 'head'),
    prNumber: integer(raw['pr-number'], 'pr-number', { min: 1, max: 999999999, fallback: null }),
    language: oneOf(raw.language, 'language', LANGUAGES, 'en'),
    title: text(raw.title, 'title', { max: 200 }) || null,
    instructions: text(raw.instructions, 'instructions', { max: 4000 }) || null,
    model: text(raw.model, 'model', { max: 64 }) || DEFAULT_MODEL,
    reportId: text(raw['report-id'], 'report-id', { max: 40 }) || defaultReportId,
    retentionDays: integer(raw['retention-days'], 'retention-days', { min: 1, max: 90, fallback: 30 }),
    timeoutSeconds: integer(raw['timeout-seconds'], 'timeout-seconds', { min: 30, max: 21600, fallback: 600 }),
    maxInputBytes: integer(raw['max-input-bytes'], 'max-input-bytes', { min: 10000, max: 2000000, fallback: 200000 }),
    maxAttempts: integer(raw['max-attempts'], 'max-attempts', { min: 1, max: 5, fallback: 2 }),
    onEmpty: oneOf(raw['on-empty'], 'on-empty', ON_EMPTY, 'report'),
    baseStrategy: oneOf(raw['base-strategy'], 'base-strategy', BASE_STRATEGIES, 'previous-stable'),
    initialRelease: oneOf(raw['initial-release'], 'initial-release', INITIAL_RELEASE, 'full'),
  };
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(inputs.model)) throw new InputError('model', 'not a model name');
  if (!REPORT_ID_PATTERN.test(inputs.reportId)) {
    throw new InputError('report-id', 'use 1-40 letters, digits, hyphens or underscores, starting with a letter or digit');
  }
  return inputs;
}

export function parsePublishInputs(raw, env = process.env) {
  const token = String(raw['github-token'] ?? '');
  if (!token.trim()) throw new InputError('github-token', 'a token is required');
  const target = oneOf(raw.target, 'target', PUBLISH_TARGETS, '');
  const reportId = text(raw['report-id'], 'report-id', { max: 40 }) || 'default';
  if (!REPORT_ID_PATTERN.test(reportId)) throw new InputError('report-id', 'not a valid report id');
  const inputs = {
    token,
    target,
    reportId,
    sourceRunId: integer(raw['source-run-id'], 'source-run-id', { min: 1, max: 999999999999, fallback: Number(env.GITHUB_RUN_ID) || null }),
    prNumber: integer(raw['pr-number'], 'pr-number', { min: 1, max: 999999999, fallback: null }),
    generationResult: oneOf(raw['generation-result'], 'generation-result', GENERATION_RESULTS, 'success'),
    releaseTag: ref(raw['release-tag'], 'release-tag'),
    createDraft: boolean(raw['create-draft'], 'create-draft', false),
    updateReleaseBody: boolean(raw['update-release-body'], 'update-release-body', true),
    replaceAssets: boolean(raw['replace-assets'], 'replace-assets', false),
    commentAuthor: text(raw['comment-author'], 'comment-author', { max: 100 }) || 'github-actions[bot]',
  };
  if (!inputs.sourceRunId) throw new InputError('source-run-id', 'a run id is required');
  if (target === 'release' && !inputs.releaseTag) throw new InputError('release-tag', 'required when target is release');
  return inputs;
}
