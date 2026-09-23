/*
 * The lockfile has to carry every platform, not just the one it was made on.
 *
 * npm records an optional dependency for the platform it resolved on. Given an
 * existing node_modules, regenerating the lockfile can record only that one —
 * which is exactly what happened when this repository was split into packages:
 * the lockfile went from eleven Lightning CSS bindings to one, and a Linux CI
 * runner would have installed no native binding at all and failed to load it.
 *
 * The failure surfaces on the first push, in CI, after the change that caused
 * it has been forgotten. Cheaper to assert here.
 *
 * If this fails: rm -rf node_modules package-lock.json && npm install.
 * A clean install records every platform; regenerating over an existing tree
 * does not.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
const names = Object.keys(lock.packages ?? {});

/* The native packages this build actually needs on a CI runner. */
const REQUIRED = [
  "lightningcss-linux-x64-gnu",
  "@voidzero-dev/vite-plus-linux-x64-gnu",
  "@esbuild/linux-x64",
];

const missing = REQUIRED.filter(
  (pkg) => !names.some((n) => n === `node_modules/${pkg}` || n.endsWith(`/node_modules/${pkg}`))
);

if (missing.length) {
  console.error("package-lock.json is missing native bindings CI will need:\n");
  for (const m of missing) console.error("  " + m);
  console.error("\nrm -rf node_modules package-lock.json && npm install");
  process.exit(1);
}

const linux = names.filter((n) => n.includes("linux")).length;
console.log(`package-lock.json carries the Linux bindings CI needs (${linux} linux entries).`);
