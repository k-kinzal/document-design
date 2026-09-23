# doc-publish

Assembles doc-ui and doc-site builds into a persistent GitHub Pages publication.
This private workspace uses Node.js built-ins and owns the publication tests.

```sh
npm run build --workspace doc-publish
npm test --workspace doc-publish
```

`build` previews the working tree as a main build and a release in the root
`pages/` directory. Build doc-ui, doc-site, and Storybook first, or use the root
`npm run build:pages` command.

The Pages workflow uses these commands after validation:

```sh
npm run stage --workspace doc-publish -- /absolute/build
npm run assemble --workspace doc-publish -- /absolute/build /absolute/archive refs/heads/main FULL_MAIN_SHA
npm run export --workspace doc-publish -- /absolute/archive /absolute/pages
```

For a release, pass `refs/tags/vX.Y.Z` instead of `refs/heads/main`. The tag must
match the staged package version. `assemble` preserves all immutable release
and commit paths and manages compatible aliases. Main builds update only their
commit snapshot, `/latest/`, and legal supplements (`/LICENSE`, `/licenses/`);
the highest stable release owns the single site
and Storybook. `export` omits Git worktree metadata from the deployable artifact.

The workflow restores and commits the `gh-pages` archive before deploying it.
See [Development and releases](../../docs/DEVELOPMENT.md) for the public URL
contract, initial Pages setup, and release procedure.
