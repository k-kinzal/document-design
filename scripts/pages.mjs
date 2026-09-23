/*
 * Assembles what gh-pages serves, from every package that contributes to it.
 *
 *   /                  the product page — what doc-ui is and why
 *   /storybook/        the component list
 *   /v1/…              the stable URL a consumer links
 *   /latest/…          the tip of main, for trying a change early
 *
 * A major version gets its own directory and is never rewritten in a way that
 * changes what a page already looks like: the consumers of this are generated
 * documents that get archived, and a document that silently restyles itself a
 * year after it was written is not an archive.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "pages");
const docUi = join(root, "packages/doc-ui");
const site = join(root, "packages/product-page");

const pkg = JSON.parse(readFileSync(join(docUi, "package.json"), "utf8"));
const major = `v${pkg.version.split(".")[0]}`;

const need = (path, what) => {
  if (existsSync(path)) return true;
  console.error(`missing ${what}: ${path}`);
  return false;
};

if (!need(join(docUi, "dist"), "doc-ui build") ||
    !need(join(docUi, "storybook-static"), "storybook build")) {
  console.error("run `npm run build` and `npm run build:storybook` first.");
  process.exit(1);
}

/*
 * Emptied first. cpSync merges into whatever is already there, so a file that
 * a previous layout produced — a Storybook build that used to sit at the root,
 * say — would survive into the published site and be served alongside the
 * thing that replaced it.
 */
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

/* The product page is the root. While it is a placeholder that is still true —
   it is the first thing a visitor sees, so it is the first thing to replace. */
if (existsSync(join(site, "public"))) {
  cpSync(join(site, "public"), out, { recursive: true });
} else {
  console.warn("packages/product-page/public is absent; the site root will be empty.");
}

cpSync(join(docUi, "storybook-static"), join(out, "storybook"), { recursive: true });

for (const dir of [major, "latest"]) {
  const target = join(out, dir);
  mkdirSync(target, { recursive: true });
  cpSync(join(docUi, "dist"), target, { recursive: true });
  writeFileSync(join(target, "VERSION"), `${pkg.version}\n${new Date().toISOString()}\n`);
}

/* GitHub Pages runs the whole tree through Jekyll unless told not to, which
   silently drops any file or directory whose name begins with an underscore —
   and a Storybook build has several. */
writeFileSync(join(out, ".nojekyll"), "");

console.log(`pages/ assembled: / (site) + /storybook/ + /${major}/ + /latest/`);
