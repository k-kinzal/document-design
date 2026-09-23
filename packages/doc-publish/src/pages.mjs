// Keep immutable distributions and a single site built from the latest release.
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync, mkdtempSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const stable = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const distribution = /^(?:v\d+(?:\.\d+){0,2}|[a-f0-9]{40}|latest)$/;
const readJSON = path => JSON.parse(readFileSync(path, 'utf8'));
const writeJSON = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

function filesAt(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Publication cannot contain a symlink: ${path}`);
    return entry.isDirectory() ? filesAt(join(dir, entry.name), path) : [path];
  }).sort();
}

function replace(source, target) {
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
}

function immutable(source, target) {
  if (!existsSync(target)) {
    cpSync(source, target, { recursive: true });
    return;
  }
  const files = filesAt(source);
  if (JSON.stringify(files) !== JSON.stringify(filesAt(target)) ||
      files.some(file => !readFileSync(join(source, file)).equals(readFileSync(join(target, file))))) {
    throw new Error(`Refusing to overwrite immutable distribution: ${target}`);
  }
}

function compareTags(a, b) {
  const left = a.match(stable).slice(1).map(BigInt);
  const right = b.match(stable).slice(1).map(BigInt);
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] > right[i] ? 1 : -1;
  }
  return 0;
}

export function stage(source, out, commit) {
  const pkg = readJSON(join(source, 'packages/doc-ui/package.json'));
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(source, 'packages/doc-ui/dist'), join(out, 'ui'), { recursive: true });
  cpSync(join(source, 'DESIGN.md'), join(out, 'ui/DESIGN.md'));
  writeFileSync(join(out, 'ui/VERSION'), `${pkg.version}\n${commit}\n`);
  // The generator includes distributions for standalone/file:// previews.
  // Publication manages these separately, so a release cannot replace main.
  const site = join(out, 'site');
  mkdirSync(site);
  const builtSite = join(source, 'packages/doc-site/dist');
  for (const name of readdirSync(builtSite)) {
    if (!distribution.test(name)) cpSync(join(builtSite, name), join(site, name), { recursive: true });
  }
  cpSync(join(source, 'packages/doc-ui/storybook-static'), join(site, 'storybook'), { recursive: true });
  cpSync(join(source, 'DESIGN.md'), join(site, 'DESIGN.md'));
  writeJSON(join(out, 'build.json'), { version: pkg.version, commit });
}

export function publish(input, out, { ref, mainCommit }) {
  const build = readJSON(join(input, 'build.json'));
  if (!/^[a-f0-9]{40}$/.test(build.commit)) throw new Error('A full 40-character commit SHA is required.');
  const isMain = ref === 'refs/heads/main';
  const tag = ref.startsWith('refs/tags/') ? ref.slice('refs/tags/'.length) : null;
  if (!isMain && (!tag || !stable.test(tag))) throw new Error('Publish main or a stable vX.Y.Z tag.');
  if (tag && tag !== `v${build.version}`) throw new Error(`Tag ${tag} does not match doc-ui version ${build.version}.`);
  const manifestPath = join(out, 'versions.json');
  const versions = existsSync(manifestPath) ? readJSON(manifestPath) : { schema: 1, releases: {}, main: null, site: null };
  if (versions.schema !== 1) throw new Error('Unsupported publication manifest.');
  if (tag && versions.releases[tag] && versions.releases[tag].commit !== build.commit) {
    throw new Error(`Tag ${tag} was already published from another commit.`);
  }
  mkdirSync(out, { recursive: true });
  const ui = join(input, 'ui');
  if (isMain) {
    immutable(ui, join(out, build.commit));
    // A delayed run may archive its commit, but cannot roll back /latest/.
    if (build.commit === mainCommit) {
      replace(join(out, build.commit), join(out, 'latest'));
      versions.main = build;
    }
  } else {
    immutable(ui, join(out, tag));
    versions.releases[tag] = build;
    const aliases = new Map();
    for (const release of Object.keys(versions.releases).sort(compareTags)) {
      const [, major, minor] = release.match(stable);
      aliases.set(`v${major}`, release);
      aliases.set(`v${major}.${minor}`, release);
    }
    for (const [alias, release] of aliases) replace(join(out, release), join(out, alias));
    if (!versions.site || compareTags(tag, versions.site.tag) > 0) {
      const site = join(input, 'site');
      const files = filesAt(site);
      for (const file of files) {
        const first = file.split(/[\\/]/)[0];
        if (distribution.test(first) || first === '.git' || first === 'versions.json') {
          throw new Error(`Site file conflicts with publication storage: ${file}`);
        }
      }
      // Only site-owned files are replaced; all previous distributions survive.
      for (const file of versions.site?.files ?? []) rmSync(join(out, file), { force: true });
      cpSync(site, out, { recursive: true });
      versions.site = { tag, commit: build.commit, files };
    }
  }
  writeFileSync(join(out, '.nojekyll'), '');
  writeJSON(manifestPath, versions);
  return versions;
}

export function exportPages(archive, out) {
  rmSync(out, { recursive: true, force: true });
  cpSync(archive, out, { recursive: true, filter: source => source !== join(archive, '.git') });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  const commit = () => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  if (command === 'stage' && args.length === 1) {
    stage(root, resolve(args[0]), commit());
  } else if (command === 'publish' && args.length === 4) {
    const versions = publish(resolve(args[0]), resolve(args[1]), { ref: args[2], mainCommit: args[3] });
    if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `has-site=${Boolean(versions.site)}\n`, { flag: 'a' });
    console.log(`Archived ${args[2]}; product site: ${versions.site?.tag ?? 'awaiting the first release'}.`);
  } else if (command === 'export' && args.length === 2) {
    exportPages(resolve(args[0]), resolve(args[1]));
  } else if (!command) {
    const temp = mkdtempSync(join(tmpdir(), 'doc-pages-'));
    try {
      const sha = commit();
      stage(root, temp, sha);
      const out = join(root, 'pages');
      rmSync(out, { recursive: true, force: true });
      publish(temp, out, { ref: 'refs/heads/main', mainCommit: sha });
      const { version } = readJSON(join(temp, 'build.json'));
      publish(temp, out, { ref: `refs/tags/v${version}`, mainCommit: sha });
      console.log(`pages/ preview assembled for v${version} and ${sha}.`);
    } finally { rmSync(temp, { recursive: true, force: true }); }
  } else {
    throw new Error('Usage: pages.mjs [stage <dir> | publish <build> <archive> <ref> <main-sha> | export <archive> <out>]');
  }
}
