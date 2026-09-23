import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Storybook 10.6.0 omits LICENSE from several npm packages. Keep the exact
// upstream text locally so builds stay reproducible and need no network.
// Source: https://github.com/storybookjs/storybook/blob/v10.6.0/LICENSE
export function licenseNotices() {
  let out;
  return {
    name: 'doc-ui-license-notices',
    apply: 'build',
    configResolved(config) { out = resolve(config.root, config.build.outDir); },
    closeBundle() {
      const path = resolve(out, 'third-party-licenses.json');
      const licenses = JSON.parse(readFileSync(path, 'utf8'));
      if (!licenses.some(entry => entry.name === 'storybook' && entry.version === '10.6.0')) {
        throw new Error('Review Storybook static assets and vendored notices for the new version.');
      }
      for (const entry of licenses) {
        if (!entry.text && entry.version === '10.6.0' && entry.identifier === 'MIT' &&
            (entry.name === 'storybook' || entry.name.startsWith('@storybook/'))) {
          entry.text = readFileSync(new URL('./licenses/storybook-10.6.0.txt', import.meta.url), 'utf8').trim();
        }
        if (!entry.identifier || !entry.text?.trim()) {
          throw new Error(`Review the missing license notice for ${entry.name}@${entry.version}.`);
        }
      }
      // Static manager fonts are copied by Storybook, outside Vite's module graph.
      // Source: https://github.com/googlefonts/NunitoSans/blob/main/OFL.txt
      licenses.push({ name: 'Nunito Sans', version: '3.006', identifier: 'OFL-1.1',
        text: readFileSync(new URL('./licenses/nunito-sans-OFL.txt', import.meta.url), 'utf8').trim() });
      // Vendored by addon-docs, so it has no separate installed package metadata.
      // Source: https://github.com/storybookjs/storybook/blob/v10.6.0/code/addons/docs/src/blocks/controls/react-editable-json-tree/LICENSE.md
      licenses.push({ name: 'react-editable-json-tree (vendored by Storybook)', version: '10.6.0', identifier: 'MIT',
        text: readFileSync(new URL('./licenses/react-editable-json-tree.txt', import.meta.url), 'utf8').trim() });
      licenses.push({ name: 'Storybook prebundled dependencies', version: '10.6.0',
        identifier: 'MIT AND ISC AND Apache-2.0 AND BSD-3-Clause AND 0BSD AND OFL-1.1',
        text: readFileSync(new URL('./licenses/prebundled-10.6.0.md', import.meta.url), 'utf8').trim() });
      const markdown = '# Third-party licenses\n\n' + licenses.map(entry =>
        `## ${entry.name} - ${entry.version} (${entry.identifier})\n\n${entry.text.trim()}\n`
      ).join('\n');
      writeFileSync(path, `${JSON.stringify(licenses, null, 2)}\n`);
      writeFileSync(resolve(out, 'THIRD_PARTY_LICENSES.md'), markdown);
      copyFileSync(new URL('../LICENSE', import.meta.url), resolve(out, 'LICENSE'));
    },
  };
}
