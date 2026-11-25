// Assembles a ready-to-upload folder for GreenGeeks cPanel (Passenger) hosting.
// Run after `npm run build`: node scripts/package-cpanel.mjs
// Output: cpanel-release/ containing app.cjs, package.json and .output/
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "cpanel-release");
const buildDir = path.join(root, ".output");

const nitro = JSON.parse(
  await readFile(path.join(buildDir, "nitro.json"), "utf8").catch(() => "{}"),
);
if (nitro.preset !== "node-server") {
  console.error(
    `[package-cpanel] .output was built for preset "${nitro.preset ?? "unknown"}", expected "node-server". Run "npm run build" outside Lovable first.`,
  );
  process.exit(1);
}
await stat(path.join(buildDir, "server", "index.mjs"));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(buildDir, path.join(outDir, ".output"), { recursive: true });
await cp(path.join(root, "app.cjs"), path.join(outDir, "app.cjs"));

// Runtime packages the server bundle still imports by name. Nitro's tracer normally copies
// them into .output/server/node_modules, but the release must not depend on that: copy the
// full package from the project install whenever the traced copy is missing or incomplete.
// Only .output/ is deployed, so they must live inside it.
const RUNTIME_PACKAGES = ["tslib"];
const releaseModules = path.join(outDir, ".output", "server", "node_modules");
for (const name of RUNTIME_PACKAGES) {
  const target = path.join(releaseModules, name);
  const ok = await stat(path.join(target, "package.json")).then(() => true, () => false);
  const traced = ok && (await stat(path.join(target, "tslib.js")).then(() => true, () => false));
  if (!traced) {
    const source = path.join(root, "node_modules", name);
    await stat(path.join(source, "package.json")).catch(() => {
      console.error(`[package-cpanel] Runtime package "${name}" is not installed. Run "npm ci" first.`);
      process.exit(1);
    });
    await rm(target, { recursive: true, force: true });
    await mkdir(releaseModules, { recursive: true });
    await cp(source, target, { recursive: true });
    console.log(`[package-cpanel] Added ${name} to .output/server/node_modules`);
  }
}

// Minimal manifest: the server bundle is self-contained, so there is nothing to npm-install.
await writeFile(
  path.join(outDir, "package.json"),
  JSON.stringify(
    {
      name: "accendis",
      private: true,
      type: "commonjs",
      main: "app.cjs",
      engines: { node: ">=22" },
      scripts: { start: "node app.cjs" },
    },
    null,
    2,
  ) + "\n",
);

console.log(
  `[package-cpanel] Ready: ${path.relative(root, outDir)}/ (upload its contents to the cPanel application root)`,
);
