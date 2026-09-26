// Constants that define the public contract of one action version.
// Every value here is recorded in the manifest, so a report can say which
// generator, prompt and CLI produced it.

export const ACTION_NAME = 'document-design-report';
export const ACTION_VERSION = '1.0.0';

// The Copilot CLI is pinned. Update it deliberately, run the unit tests and
// a real main push, then record the new version in the release notes.
export const COPILOT_CLI_PACKAGE = '@github/copilot';
export const COPILOT_CLI_VERSION = '1.0.88';

// `auto` lets Copilot route to a model the caller's plan allows. The models
// actually used are read back from the CLI's usage file and recorded.
export const DEFAULT_MODEL = 'auto';

// Bump when the prompt text or the JSON contract given to the model changes.
export const PROMPT_VERSION = '1';

export const MANIFEST_SCHEMA = 1;

// Prefix of every artifact and asset file name this action creates.
export const FILE_PREFIX = 'document-design';

export const REPORT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;

export const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
export const ZERO_SHA = '0000000000000000000000000000000000000000';
