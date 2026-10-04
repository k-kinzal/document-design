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

  // Follow the actual bundle, including nested dependencies, so a parser
  // upgrade cannot silently drop the notices that must travel with the CLI.
  const packages = new Map();
  for (const input of Object.keys(result.metafile.inputs)) {
    if (!input.includes('node_modules/')) continue;
    let dir = dirname(resolve(here, input));
    while (!existsSync(join(dir, 'package.json'))) {
      const parent = dirname(dir);
      if (parent === dir) throw new Error(`Cannot find package metadata for ${input}`);
      dir = parent;
    }
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    // Reviewed permissive licenses; both require their notices to travel with
    // redistributed code. Fail closed when a dependency changes its terms.
    if (!['MIT', 'BSD-2-Clause'].includes(pkg.license)) throw new Error(`Review CLI dependency license: ${pkg.name} (${pkg.license})`);
    const licenses = readdirSync(dir).filter(name => /^(?:license|copying|notice)(?:[.-].*)?$/i.test(name)).sort();
    if (!licenses.length) throw new Error(`Missing license text for ${pkg.name}`);
    packages.set(`${pkg.name}@${pkg.version}`, licenses.map(name => readFileSync(join(dir, name), 'utf8').trim()).join('\n\n'));
  }
  const notices = [...packages].sort(([a], [b]) => a.localeCompare(b))
    .map(([name, license]) => `${name}\n${'='.repeat(name.length)}\n\n${license}\n`).join('\n');
  writeFileSync(join(dist, 'CLI-NOTICES.txt'), `Third-party licenses for cli.mjs\n\n${notices}`);
  console.log('cli.mjs + CLI-NOTICES.txt'.padEnd(32), `${packages.size} bundled packages`);
}
