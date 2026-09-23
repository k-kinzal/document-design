# product-page

The page that presents doc-ui: what it is, what it looks like, how to use it.
Served at the root of gh-pages, with the component list under `/storybook/`.

**Not built yet.** `public/` currently holds a placeholder so the publishing
seam is real rather than theoretical — the workflow copies this directory to the
site root today, and will keep doing so when there is something better here.

## The one rule

**Build it with doc-ui.** A design system whose own site does not use it is a
design system nobody has checked. The placeholder already links the published
stylesheet rather than carrying styles of its own, and anything that replaces it
should do the same.

That also makes this the system's first outside consumer, which is the point:
whatever is awkward to write here is awkward to write in php-ai-toolkit and
ztd-query-php too.

## Where it fits

```
/                  ← this package
/storybook/        ← packages/doc-ui, the component list
/v1/  /latest/     ← packages/doc-ui, the stylesheet itself
```

Adding a build step: give this package a `build` script that emits into
`public/`, and the root `npm run build` picks it up through the workspace.
`scripts/pages.mjs` needs no change.
