# Licenses and dependencies

The project's original code, documentation, and assets are licensed under
[MIT](../LICENSE), copyright 2026 k-kinzal. Third-party materials keep their
own licenses; the project license does not relicense them.

## Distribution review

Reviewed on 2026-09-23 against `package-lock.json`, package license files,
the generated CSS/JavaScript, and the static Storybook output.

- **doc-ui:** no third-party runtime dependencies. Lightning CSS transforms
  our CSS, and the optional JavaScript is our own standalone source. New
  builds include the full MIT notice in each CSS/JS file and `dist/LICENSE`.
  The npm package also includes its own `LICENSE`.
- **Product site:** uses doc-ui. Shiki generates highlighted HTML at build
  time; its JavaScript and grammar packages are not shipped to readers.
  The site uses system fonts, and the README image is a maintainer-provided
  screenshot of this project.
- **Storybook:** separately distributes third-party code. Vite records
  bundled packages and license texts in `third-party-licenses.json` and
  `THIRD_PARTY_LICENSES.md`. Several Storybook 10.6.0 npm packages omit their
  MIT text; the build supplies the [upstream license](https://github.com/storybookjs/storybook/blob/v10.6.0/LICENSE).
  Copied Nunito Sans fonts retain [SIL OFL 1.1](https://github.com/googlefonts/NunitoSans/blob/main/OFL.txt).
  These font terms do not apply to doc-ui's CSS or consumers' documents.
  The upstream browser bundles also contain dependencies absent from our
  lockfile. Their [supplemental notices](../packages/doc-ui/.storybook/licenses/prebundled-10.6.0.md)
  cover 153 package names and 199 upstream locked versions, including any
  unused versions conservatively. All declare permissive licenses. Two
  packages (`toggle-selection`, `use-composed-ref`) declare MIT in metadata
  but supply no license text; their author or maintainer metadata and standard MIT terms
  are included without inventing copyright statements. A vendored
  `react-editable-json-tree` notice is also retained.
- **Build and test dependencies:** Lightning CSS and axe-core are MPL-2.0;
  caniuse-lite data is CC-BY-4.0. They are used as tools or build data, not
  included in the CSS/JS distribution. No modifications to their sources
  are distributed. See the [MPL FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)
  for the distinction between using tools and distributing covered code.

All 383 external lockfile entries, including optional platform variants, have
license identifiers: MIT (351), Apache-2.0 (7), ISC (6), MPL-2.0 (13),
CC-BY-4.0 (1), BSD-2-Clause (2), BSD-3-Clause (2), and 0BSD (1).
No GPL, AGPL, noncommercial, or unknown identifiers were found in that lockfile.
`npm audit` reported zero known vulnerabilities at review time.

## Existing release

`v1.0.0` predates the license files. Its immutable distribution files and tag
are preserved. The project MIT grant is available at the publication's
`/LICENSE`; [Storybook notices for that release](licenses/storybook-v1.0.0.md)
are also published at `/licenses/storybook-v1.0.0.md`. Keep these notices with
offline copies. New releases include notices in the generated artifacts.

## Updating dependencies

`npm run check` checks license metadata and flags newly encountered license
terms. The Storybook build fails when a bundled package lacks a license
identifier or text. Review package contents as well as metadata: copied fonts
and upstream prebundled code are not fully inventoried by Vite's module graph.
On a Storybook upgrade, review upstream code and static assets, refresh the
version-specific license supplement if needed, and check the generated notices.
Run `npm audit` and inspect `npm pack --workspace @k-kinzal/doc-ui --dry-run`
before release. These checks cover this dependency and distribution snapshot;
they do not establish the provenance of every upstream source line.
