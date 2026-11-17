// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the server has no runtime module resolution for
// unbundled imports. Never add compression (compressPublicAssets, vite-plugin-compression).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Self-hosted target: a standalone Node.js server (GreenGeeks cPanel / Passenger, Node 22).
  // `npm run build` emits .output/ with .output/server/index.mjs as the server entry.
  // Lovable's own publish pipeline pins its hosting preset and ignores this override.
  nitro: { preset: "node-server" },
});
