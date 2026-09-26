// Where the action's own files are. Everything the action ships is resolved
// from the location of the running module, never from the analysed
// repository or the caller's working directory: the two are different
// checkouts and confusing them is how a release action reads the wrong CSS.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// `src/` while developing, `dist/` when bundled. Both hold the package root
// one level up, and the bundled file sits beside the CSS it embeds.
export const packageRoot = resolve(here, '..');
export const distDir = join(packageRoot, 'dist');

export const STYLESHEET_FILE = 'document-design.min.css';

export function stylesheetPath() {
  for (const candidate of [join(here, STYLESHEET_FILE), join(distDir, STYLESHEET_FILE)]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('doc-ui stylesheet not found beside the action code: build doc-report first (npm run build:report).');
}

export function readStylesheet() {
  return readFileSync(stylesheetPath(), 'utf8');
}

// The doc-ui version and stylesheet digest recorded at build time.
export function readStylesheetVersion() {
  for (const candidate of [join(here, 'VERSION'), join(distDir, 'VERSION')]) {
    if (existsSync(candidate)) {
      const [version, digest] = readFileSync(candidate, 'utf8').trim().split('\n');
      return { version, digest };
    }
  }
  return { version: 'unknown', digest: null };
}
