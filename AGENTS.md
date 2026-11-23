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

- Homepage sections live in `src/components/home/*` and take data via props; `HomeView` owns filter state and is shared by `/` and the admin preview, so public and preview rendering never diverge.
- Content lives in Supabase: admins edit `content_items.draft`; the `publish_content` / `unpublish_content` RPCs copy to `published_content`, the only content visitors can read. Keep drafts out of public reads by never granting anon on `content_items`.
- All stored JSON goes through the normalisers in `src/lib/content/types.ts` (tested); add fields there with defaults so older or agent-written drafts still render.
- Public reads use `createServerFn` + a publishable-key client (`public-client.server.ts`); admin reads/writes use the browser client with the user's session. No service-role key anywhere in app code, so nothing secret is needed on the host.
- Media is one private `media` bucket; storage policy lets visitors read only paths listed in `published_content.media_paths`. Public pages link via `/media/<path>` (redirects to a signed URL); previews use signed URLs through `MediaProvider`.
- App detail pages are one template (`AppDetailView`) whose ordered `body` blocks are rendered by `DetailBody.tsx`; add block types in `types.ts`, `DetailBody.tsx` and `BlockEditor.tsx` together.
- Admin routes live under `src/routes/_authenticated/admin*` (client-only gate); admin rights come only from `public.user_roles` via `is_admin()`. Setup steps are in `docs/ADMIN.md`.
- Category colours are semantic tokens in `src/styles.css`, mapped to literal classes in `src/components/home/category-styles.ts` — add new categories in both places.

## Deployment

- Self-hosted builds use Nitro's `node-server` preset (set in `vite.config.ts`) and start via `app.cjs`, a CommonJS shim for cPanel/Passenger that imports `.output/server/index.mjs`; Passenger `require()`s startup files and the package is ESM. Lovable's own publish pins its preset and ignores this override. Steps live in `DEPLOYMENT.md`.
- `package.json` keeps both `bun.lock` (Lovable) and `package-lock.json` (self-hosted `npm ci` / `npm audit`); update them together. `overrides` pin `rolldown` to one version within Vite's range (shared with Nitro) and force patched transitive `zod`; bump them when upgrading Vite or when the advisory changes.
