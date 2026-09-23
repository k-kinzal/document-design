/*
 * Assembles what gh-pages serves.
 *
 *   /                      the component list (a Storybook static build)
 *   /v1/document-design.css   the stable URL a consumer links
 *   /latest/…                 the tip of main, for trying a change early
 *
 * A major version gets its own directory and is never rewritten in a way that
 * changes what a page already looks like: the consumers of this are generated
 * documents that get archived, and a document that silently restyles itself a
 * year after it was written is not an archive.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "pages");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const major = `v${pkg.version.split(".")[0]}`;

if (!existsSync(join(root, "storybook-static"))) {
  console.error("storybook-static is missing — run `npm run build:storybook` first.");
  process.exit(1);
}

mkdirSync(out, { recursive: true });
cpSync(join(root, "storybook-static"), out, { recursive: true });

for (const dir of [major, "latest"]) {
  const target = join(out, dir);
  mkdirSync(target, { recursive: true });
  cpSync(join(root, "dist"), target, { recursive: true });
  writeFileSync(
    join(target, "VERSION"),
    `${pkg.version}\n${new Date().toISOString()}\n`
  );
}

/* GitHub Pages runs the whole tree through Jekyll unless told not to, which
   silently drops any file or directory whose name begins with an underscore —
   and a Storybook build has several. */
writeFileSync(join(out, ".nojekyll"), "");

console.log(`pages/ assembled: component list + /${major}/ + /latest/`);
