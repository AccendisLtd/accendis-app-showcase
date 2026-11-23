# Accendis content admin

The private editor lives at **/admin** (sign in at **/auth**). It edits the homepage text, app cards,
app story pages, discovery roles and category names. Content is stored in the connected Supabase project.

## Who can edit

Signing in is not enough. An account can edit only when it has a row in `public.user_roles` with role `admin`.
This is enforced by database and storage policies, not just the interface.

### Add an administrator

1. Supabase dashboard → **Authentication → Users → Add user → Create new user**. Enter the email and a password
   and tick **Auto confirm user** (or use "Send invitation").
2. Supabase dashboard → **SQL Editor**, run (replace the email):

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'person@example.com'
   on conflict do nothing;
   ```

### Remove an administrator

```sql
delete from public.user_roles
where role = 'admin' and user_id = (select id from auth.users where email = 'person@example.com');
```

### Turn off public sign-up (required)

Supabase dashboard → **Authentication → Sign In / Providers → Email**: switch off **Allow new users to sign up**.
The site has no sign-up form, but Supabase accepts sign-ups through its API until this is off. (Even then, new
accounts get no editing rights — but turning it off keeps the user list clean.)

### Sign-in URLs

Supabase dashboard → **Authentication → URL Configuration**: set **Site URL** to `https://accendis.co.uk`
and add `https://accendis.co.uk/**` plus your Lovable preview URL to **Redirect URLs** (used by password-reset
and invitation emails).

## Drafts, preview and publishing

- **Save draft** stores changes privately. Visitors keep seeing the last published version.
- **Preview** opens the draft in the real page template (only signed-in administrators can open it).
- **Publish** copies the draft to the live site immediately — no rebuild or redeploy.
- **Unpublish** removes it from the site but keeps the draft. **Archive** hides it and moves it out of the list;
  **Restore as draft** brings it back.
- Roles and category names go live as soon as you change them.

## Media

Uploads go to the private `media` storage bucket (max 50 MB per file). A file becomes viewable by visitors only
while published content references it; draft-only, unpublished or archived files stay private. Public pages load
media via `/media/<path>`.

## Content model (for future automation / agents)

Each item is a row in `public.content_items` (`kind` = `app` or `homepage`, `slug`, `status`, `draft` JSON).
An automated agent can create drafts by inserting rows with `status = 'draft'` using an administrator's session;
a human then reviews, previews and publishes. The JSON shape is defined and documented in
`src/lib/content/types.ts` (`AppContent`, `HomeContent`, `DetailBlock`); missing fields fall back to safe defaults.

Story blocks (`body`, rendered in order): `paragraph` (supports `**bold**`, `_italic_`, `[link](https://…)`),
`heading`, `list` (`bullets` or `steps`), `callout` (`info` / `tip` / `warning`), `video` (YouTube/Vimeo link or
uploaded file), `presentation` (embed link or PDF), `gallery` (screenshot carousel), `link`.
Each app also has `transparency`: `platforms`, `integrations`, `costs`, `limitations`, `diy`.
