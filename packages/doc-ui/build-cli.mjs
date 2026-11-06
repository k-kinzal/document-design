import { build } from 'esbuild';
import { chmodSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export async function buildCLI(dist) {
  const result = await build({
    absWorkingDir: here,
    entryPoints: ['src/cli/main.mjs'],
    outfile: join(dist, 'cli.mjs'),
    bundle: true, platform: 'node', format: 'esm', target: 'node22',
    metafile: true, legalComments: 'none',
    banner: { js: '/* doc-ui CLI — MIT. Bundled dependencies: see CLI-NOTICES.txt. */' },
  });
  chmodSync(join(dist, 'cli.mjs'), 0o755);

  const diagrams = await build({
    absWorkingDir: here,
    entryPoints: ['src/cli/mermaid-browser.mjs'],
    outfile: join(dist, 'mermaid.js'),
    bundle: true, platform: 'browser', format: 'iife', target: 'es2022',
    minify: true, metafile: true, legalComments: 'none',
    banner: { js: '/* Generation only. Bundled dependencies: see CLI-NOTICES.txt. */' },
  });

  // Follow the actual bundle, including nested dependencies, so a parser
  // upgrade cannot silently drop the notices that must travel with the CLI.
  const packages = new Map();
  for (const input of new Set([...Object.keys(result.metafile.inputs), ...Object.keys(diagrams.metafile.inputs)])) {
    if (!input.includes('node_modules/')) continue;
    let dir = dirname(resolve(here, input));
    let pkg;
    while (true) {
      if (existsSync(join(dir, 'package.json'))) {
        pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
        if (pkg.name && pkg.version) break;
      }
      const parent = dirname(dir);
      if (parent === dir) throw new Error(`Cannot find package metadata for ${input}`);
      dir = parent;
    }
    const licenses = readdirSync(dir).filter(name => /^(?:license|copying|notice)(?:[.-].*)?$/i.test(name)).sort();
    let text = licenses.map(name => readFileSync(join(dir, name), 'utf8').trim()).join('\n\n');
    // FastDom publishes the full MIT notice in its README rather than a file.
    if (!text && pkg.name === 'fastdom' && pkg.version === '1.0.12') {
      text = readFileSync(join(dir, 'README.md'), 'utf8').split('## License\n')[1]?.trim();
    }
    if (!text) throw new Error(`Missing license text for ${pkg.name}`);
    // Khroma omits the SPDX field, but ships the reviewed MIT license text.
    const license = pkg.license ?? (pkg.name === 'khroma' && pkg.version === '2.1.0' && text.startsWith('The MIT License (MIT)') ? 'MIT' : undefined);
    // DOMPurify is distributed under its Apache-2.0 option. Every bundled
    // package retains its complete license/notice text, including dual terms.
    if (!['MIT', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Apache-2.0', '(MPL-2.0 OR Apache-2.0)', 'Unlicense'].includes(license)) throw new Error(`Review CLI dependency license: ${pkg.name} (${license})`);
    packages.set(`${pkg.name}@${pkg.version}`, text);
  }
  const notices = [...packages].sort(([a], [b]) => a.localeCompare(b))
    .map(([name, license]) => `${name}\n${'='.repeat(name.length)}\n\n${license}\n`).join('\n');
  writeFileSync(join(dist, 'CLI-NOTICES.txt'), `Third-party licenses for cli.mjs and mermaid.js (generation only)\n\n${notices}`);
  console.log('cli.mjs + mermaid.js + notices'.padEnd(32), `${packages.size} bundled packages`);
}
