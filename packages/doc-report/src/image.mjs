import { execFile } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { PLAYWRIGHT_VERSION, renderImage } from '@k-kinzal/doc-ui/image';

const run = promisify(execFile);

export async function reportImage({ html, stateDir, env, log }) {
  const prefix = join(stateDir, 'browser');
  mkdirSync(prefix, { recursive: true });
  // Keep browser tooling out of the analysed checkout, just like Copilot.
  const options = { cwd: prefix, env, timeout: 300_000, maxBuffer: 8 * 1024 * 1024 };
  log(`Installing Playwright ${PLAYWRIGHT_VERSION} and Chromium for PNG output`);
  await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--prefix', prefix, '--no-audit', '--no-fund', '--no-package-lock', '--ignore-scripts', `playwright@${PLAYWRIGHT_VERSION}`], options);
  const pkg = join(prefix, 'node_modules/playwright');
  await run(process.execPath, [join(pkg, 'cli.js'), 'install', '--with-deps', 'chromium'], options);
  const { chromium } = await import(pathToFileURL(join(pkg, 'index.mjs')).href);
  return renderImage({ html, chromium, offline: true });
}
