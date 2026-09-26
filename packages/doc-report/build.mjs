// Build the distribution the composite actions run: one bundled module, the
// doc-ui stylesheet it embeds, and the licenses that travel with both. The
// result is committed, so a consumer's `uses:` needs no install step; a
// test compares the committed files with a fresh build.
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const uiRoot = join(repoRoot, 'packages/doc-ui');

export async function buildDist(outDir = join(here, 'dist')) {
  const cssPath = join(uiRoot, 'dist/document-design.min.css');
  if (!existsSync(cssPath)) throw new Error('Build doc-ui first: npm run build:ui');
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const license = readFileSync(join(repoRoot, 'LICENSE'), 'utf8');
  const notices = thirdPartyNotices();
  const banner = `/*!\n * document-design-report — https://github.com/k-kinzal/document-design\n * ${license.trim().split('\n').join('\n * ')}\n *\n * Bundles parse5 and entities; see THIRD-PARTY-NOTICES.md beside this file.\n */`;

  await build({
    // Paths in the output are relative to this directory, so the bundle is
    // the same whichever directory the build is started from.
    absWorkingDir: here,
    entryPoints: [join(here, 'src/cli.mjs')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    outfile: join(outDir, 'report.mjs'),
    banner: { js: banner },
    legalComments: 'none',
    logLevel: 'error',
    sourcemap: false,
    minify: false,
  });

  const css = readFileSync(cssPath, 'utf8');
  writeFileSync(join(outDir, 'document-design.min.css'), css);
  const ui = JSON.parse(readFileSync(join(uiRoot, 'package.json'), 'utf8'));
  writeFileSync(join(outDir, 'VERSION'), `${ui.version}\nsha256:${createHash('sha256').update(css).digest('hex')}\n`);
  writeFileSync(join(outDir, 'LICENSE'), license);
  writeFileSync(join(outDir, 'THIRD-PARTY-NOTICES.md'), notices);
  return outDir;
}

function thirdPartyNotices() {
  const packages = ['parse5', 'entities'];
  const sections = packages.map((name) => {
    const dir = join(repoRoot, 'node_modules', name);
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    const file = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'].map((f) => join(dir, f)).find(existsSync);
    const text = file ? readFileSync(file, 'utf8').trim() : `(license text not found; declared license ${pkg.license})`;
    return `## ${name} ${pkg.version} (${pkg.license})\n\n${text}\n`;
  });
  return `# Third-party notices\n\nThe bundled report.mjs contains the following packages.\n\n${sections.join('\n')}`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = await buildDist(process.argv[2] ? resolve(process.argv[2]) : undefined);
  console.log(`doc-report distribution written to ${out}`);
}
