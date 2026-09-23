# document-design

A design system for documentation and report pages, and the site that presents
it.

```
packages/
  doc-ui/         the design system — CSS, the optional behaviour layer, Storybook
  product-page/   the page that presents it; a placeholder for now
scripts/
  pages.mjs       assembles what gh-pages serves, from both packages
```

## Use it

```html
<link rel="stylesheet"
      href="https://k-kinzal.github.io/document-design/v1/document-design.css">
```

**[Component list and examples →](https://k-kinzal.github.io/document-design/storybook/)**

## Develop

npm workspaces; run everything from the repo root.

```sh
npm install
npm run storybook        # design and browse components at :6006
npm run build            # every package that has a build
npm run check            # every package that has a check (contrast, 150 pairs)
npm run build:pages      # what gh-pages serves
```

Or work in one package directly:

```sh
npm run build --workspace @k-kinzal/doc-ui
```

## What gets published

```
/                  the product page
/storybook/        the component list
/v1/…              the stable URL a consumer links; not rewritten in place
/latest/…          the tip of main
```

`/v1/` is not changed in a way that restyles a page already written — the
consumers here are generated documents that get archived. A breaking change
goes to `/v2/`.

## Why it is built this way

See [AGENTS.md](AGENTS.md) for the design thesis and the decisions that look
arbitrary and are not, and **Foundations → Principles** in Storybook for the
long form.
