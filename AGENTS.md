<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project structure

- Homepage sections live in `src/components/home/*` and take data/state via props; the route (`src/routes/index.tsx`) owns filter state so sections can be wired to real data later without rewrites.
- Showcase content comes from `src/data/apps.ts` and filtering/layout rules from `src/lib/showcase.ts` (tested in `showcase.test.ts`); swap the data module for a real source rather than hardcoding apps in components.
- App detail pages are one template route (`src/routes/apps.$appId.tsx`) fed by `src/data/app-details.ts`, whose ordered `body` blocks are rendered by `src/components/app-detail/DetailBody.tsx`; add or reorder content via data blocks, not per-app components.
- Category colours are semantic tokens in `src/styles.css`, mapped to literal classes in `src/components/home/category-styles.ts` — add new categories in both places.

## Deployment

- Self-hosted builds use Nitro's `node-server` preset (set in `vite.config.ts`) and start via `app.cjs`, a CommonJS shim for cPanel/Passenger that imports `.output/server/index.mjs`; Passenger `require()`s startup files and the package is ESM. Lovable's own publish pins its preset and ignores this override. Steps live in `DEPLOYMENT.md`.
- `package.json` keeps both `bun.lock` (Lovable) and `package-lock.json` (self-hosted `npm ci` / `npm audit`); update them together. `overrides` pin `rolldown` to one version within Vite's range (shared with Nitro) and force patched transitive `zod`; bump them when upgrading Vite or when the advisory changes.
