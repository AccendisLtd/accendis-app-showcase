// Assembles a ready-to-upload folder for GreenGeeks cPanel (Passenger) hosting.
// Run after `npm run build`: node scripts/package-cpanel.mjs
// Output: cpanel-release/ containing app.cjs, package.json and .output/
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
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

// Supabase imports tslib at runtime. The deploy swaps .output as a unit.
const require = createRequire(import.meta.url);
const tslibDir = path.dirname(require.resolve("tslib/package.json"));
const serverModules = path.join(outDir, ".output", "server", "node_modules");
await mkdir(serverModules, { recursive: true });
await rm(path.join(serverModules, "tslib"), { recursive: true, force: true });
await cp(tslibDir, path.join(serverModules, "tslib"), {
  recursive: true,
  dereference: true,
});

// Passenger entry point for the packaged release.
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
