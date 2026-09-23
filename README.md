# document-design

A design system for making information clear: dense catalogs you can scan and
reports you can understand at a glance.

This is an English-language project. Documentation, development tools, and default
Storybook examples use English. The output also supports Japanese, including
Japanese typography and localized product pages. Dedicated Japanese stories keep
those behaviours visible and verifiable.

```
packages/
  doc-ui/     CSS, optional behaviors, tokens and Storybook
  doc-site/   English product site and documentation with Japanese translations
scripts/
  pages.mjs   assembles both packages for GitHub Pages
```

## Develop

Use Node.js 24.11 or later (or Node.js 22.18+), then install the npm workspace:

```sh
npm install
npm run dev             # Vite+ opens the product page at :5173
npm run storybook       # component development at :6006
npm run build           # doc-ui, then doc-site
npm run check           # package checks, contrast and design-document consistency
npm test                # browser, accessibility, responsive and interaction tests
npm run preview         # preview the production site at :4173
npm run build:pages     # assemble the complete GitHub Pages artifact
```

Each package owns its dependencies, source, configuration, documentation and
commands. The root provides shortcuts and operations that combine packages.
Work directly in `packages/doc-site` or `packages/doc-ui`, or use
`npm run <command> --workspace <package-name>`.

## Use doc-ui

```html
<link rel="stylesheet"
      href="https://k-kinzal.github.io/document-design/v1/document-design.css">
```

[Product site](https://k-kinzal.github.io/document-design/) ·
[Component gallery and usage](https://k-kinzal.github.io/document-design/components/) ·
[Storybook](https://k-kinzal.github.io/document-design/storybook/)

## Publication layout

```
/                      product page
/start/                quick start and setup
/components/           visual component gallery
/components/<name>/    individual examples and usage
/ja/…                  Japanese versions of the same pages
/storybook/            development stories and variations
/v1/…                  stable major-version artifacts
/latest/…              tip of main
```

The Pages workflow builds, checks and tests the packages, then deploys `pages/`
on pushes to `main`. Pull requests build and test without deploying.

In the repository's **Settings → Pages**, set **Build and deployment → Source**
to **GitHub Actions** before the first deployment. The workflow can also be run
manually from the Actions tab. It publishes the assembled artifact directly;
no `gh-pages` branch is needed.

Commit source files and `package-lock.json`. Dependencies, generated HTML,
build artifacts, test reports, and local `.env` files are ignored. Shareable
environment templates may use `.env.example` or `.env.<name>.example`.

`/v1/` is not changed in a way that restyles a page already written; consumers
are generated documents that get archived. A breaking change belongs in `/v2/`.

See [AGENTS.md](AGENTS.md) for the design principles,
[doc-ui](packages/doc-ui/README.md) for the library, and
[doc-site](packages/doc-site/README.md) for the site's architecture.
