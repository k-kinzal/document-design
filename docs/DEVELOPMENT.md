# Development and releases

Routine work goes directly to `main`. External pull requests are not accepted.
Releases are deliberate checkpoints, not a requirement for every commit.

## Workspaces

| Package | Owns |
| --- | --- |
| `doc-ui` | CSS, tokens, optional behaviors, and Storybook |
| `doc-site` | English documentation and Japanese translations |
| `doc-publish` | Versioned distribution archives and Pages assembly |

Each package owns its npm commands, source, configuration, and tests. Root
commands coordinate them; root tests check the lockfile and design contract.
Do not add a `scripts/` directory.

## Local development

Use Node.js 24.11+ (or 22.18+) and install the npm workspace:

```sh
npm ci
npm run dev             # product site at :5173
npm run storybook       # component development at :6006
npm run check           # language, links, design contract, contrast, drawing roles
npm test                # publication and browser tests
npm run build:pages     # complete local publication preview in pages/
```

Local browser tests use installed Google Chrome. CI installs Playwright
Chromium. `DOC_SITE_NO_OPEN=1` suppresses automatic browser opening.

Commit source and `package-lock.json`. Dependencies, generated HTML, build
artifacts, test reports, and local `.env` files are ignored. Environment
templates may use `.env.example` or `.env.<name>.example`.

## Publication

Keep **Settings → Pages → Build and deployment → Source** set to **GitHub Actions**.
In **Settings → Environments → github-pages**, allow the `main` branch and
the `v*.*.*` tag pattern as deployment sources.
The Pages workflow validates `main`, stable `vX.Y.Z` tags, and any pull requests.
Pull requests never publish. Publication runs are serialized.

| URL below the project path | Contents |
| --- | --- |
| `/`, `/start/`, `/components/`, `/ja/…` | Single product site from the highest stable release |
| `/storybook/` | Storybook from that same release |
| `/v1.0.0/` | Immutable full release |
| `/v1.0/` | Highest compatible patch in the minor series |
| `/v1/` | Highest compatible release in the major series |
| `/<40-character SHA>/` | Immutable build of a published main commit |
| `/latest/` | Latest successfully published main-tip build |
| `/versions.json` | Published versions and their source commits |

New distribution paths include `LICENSE`, CSS, minified CSS, tokens, optional JavaScript,
`DESIGN.md`, and a `VERSION` file containing the package version and commit SHA.
Short aliases are publication paths, not movable Git tags.

The `gh-pages` branch stores previous distributions so later deployments do not
remove them. Do not edit it by hand. Main builds preserve the released product
site and its pinned CSS/JS. An older maintenance tag can update its minor alias
without rolling back the major alias or product site. Before the first release,
main builds are archived without replacing the public site.

Legal supplements at `/LICENSE` and `/licenses/` also publish from main, so
missing notices can accompany existing releases without changing their bytes.
See [Licenses and dependencies](LICENSES.md) for the review and update process.

Full release and commit paths are immutable: a rerun fails if the generated
files differ from those already published. A breaking visual change belongs in
a new major version; compatible aliases must not restyle archived documents.
Use a full version or save an offline copy when exact bytes must remain fixed.

## Releases

1. Update `packages/doc-ui/package.json` and the matching doc-site dependency.
2. Refresh `package-lock.json` with `npm install --package-lock-only` and verify
   that it still includes native packages for Linux CI.
3. Run `npm run check`, `npm test`, and `npm run build:pages`.
4. Commit and push `main`, then create an annotated tag matching the UI version:

   ```sh
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

5. Wait for Pages to succeed and publish GitHub release notes describing the
   user-facing changes, full-version stylesheet URL, and documentation links.

Use the intended new version in both tag commands. The workflow rejects a tag
that does not match the package version. Do not move a published tag to repair
a release; publish a new version instead. A failed deployment can be retried
from Actions without changing the tag.

`npm run build:pages` creates a fresh local preview from the working tree; it
does not modify the archive branch. See [doc-publish](../packages/doc-publish/README.md)
for the staging and archive commands.

## README screenshots

Keep actual product screenshots in `docs/images/`; do not substitute mockups.
The README uses the maintainer-supplied dark-theme product screenshot, showing
the report typography and reading-order figure. Update it when the visible
design changes, using the released site. Preserve the original capture.

See [AGENTS.md](../AGENTS.md) for design and repository rules and the
[doc-site](../packages/doc-site/README.md) and
[doc-ui](../packages/doc-ui/README.md) guides for package-specific work.
