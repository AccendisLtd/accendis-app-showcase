create type public.app_role as enum ('admin');
create type public.content_status as enum ('draft','published','archived');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can see their own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;
revoke execute on function public.has_role(uuid, public.app_role) from anon, public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.categories (
  id text primary key,
  name text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "Anyone can read categories" on public.categories for select to anon, authenticated using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger categories_updated before update on public.categories for each row execute function public.set_updated_at();

create table public.roles (
  id text primary key,
  name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);
grant select on public.roles to anon, authenticated;
grant insert, update, delete on public.roles to authenticated;
grant all on public.roles to service_role;
alter table public.roles enable row level security;
create policy "Visitors read active roles" on public.roles for select to anon, authenticated using (is_active or public.is_admin());
create policy "Admins insert roles" on public.roles for insert to authenticated with check (public.is_admin());
create policy "Admins update roles" on public.roles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete roles" on public.roles for delete to authenticated using (public.is_admin());
create trigger roles_updated before update on public.roles for each row execute function public.set_updated_at();

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  slug text not null,
  status public.content_status not null default 'draft',
  draft jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  has_unpublished_changes boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (kind, slug)
);
grant select, insert, update, delete on public.content_items to authenticated;
grant all on public.content_items to service_role;
alter table public.content_items enable row level security;
create policy "Admins manage content" on public.content_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger content_items_updated before update on public.content_items for each row execute function public.set_updated_at();

create or replace function public.validate_content_item() returns trigger language plpgsql set search_path = public as $$
begin
  if new.kind not in ('app','homepage') then raise exception 'Unknown content kind %', new.kind; end if;
  if new.slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'Slug must be lowercase words joined by hyphens'; end if;
  if jsonb_typeof(new.draft) <> 'object' then raise exception 'Draft must be an object'; end if;
  if tg_op = 'UPDATE' and new.draft is distinct from old.draft then new.has_unpublished_changes = true; end if;
  return new;
end; $$;
create trigger content_items_validate before insert or update on public.content_items for each row execute function public.validate_content_item();

create table public.published_content (
  item_id uuid primary key references public.content_items(id) on delete cascade,
  kind text not null,
  slug text not null,
  data jsonb not null,
  sort_order int not null default 0,
  media_paths text[] not null default '{}',
  published_at timestamptz not null default now(),
  unique (kind, slug)
);
grant select on public.published_content to anon, authenticated;
grant all on public.published_content to service_role;
alter table public.published_content enable row level security;
create policy "Anyone reads published content" on public.published_content for select to anon, authenticated using (true);

create or replace function public.content_media_paths(_data jsonb) returns text[] language sql immutable set search_path = public as $$
  select coalesce(array_agg(distinct v #>> '{}'), '{}')
  from jsonb_path_query(_data, 'lax $.**.path') v
  where jsonb_typeof(v) = 'string'
$$;

create or replace function public.publish_content(_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare it public.content_items;
begin
  if not public.is_admin() then raise exception 'Only administrators can publish' using errcode = '42501'; end if;
  select * into it from public.content_items where id = _id for update;
  if not found then raise exception 'Content not found'; end if;
  insert into public.published_content (item_id, kind, slug, data, sort_order, media_paths, published_at)
  values (it.id, it.kind, it.slug, it.draft, it.sort_order, public.content_media_paths(it.draft), now())
  on conflict (item_id) do update set slug = excluded.slug, data = excluded.data, sort_order = excluded.sort_order,
    media_paths = excluded.media_paths, published_at = excluded.published_at;
  update public.content_items set status = 'published', published_at = now(), has_unpublished_changes = false where id = _id;
end; $$;

create or replace function public.unpublish_content(_id uuid, _archive boolean default false) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only administrators can change publishing' using errcode = '42501'; end if;
  delete from public.published_content where item_id = _id;
  update public.content_items set status = case when _archive then 'archived'::public.content_status else 'draft'::public.content_status end,
    has_unpublished_changes = true where id = _id;
end; $$;
revoke execute on function public.publish_content(uuid) from public, anon;
revoke execute on function public.unpublish_content(uuid, boolean) from public, anon;
grant execute on function public.publish_content(uuid) to authenticated;
grant execute on function public.unpublish_content(uuid, boolean) to authenticated;

-- Storage: private bucket "media" (created separately). Admins write; visitors read only published media.
create policy "Admins read media" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "Admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "Admins update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "Admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "Visitors read published media" on storage.objects for select to anon, authenticated using (
  bucket_id = 'media' and exists (select 1 from public.published_content pc where storage.objects.name = any(pc.media_paths))
);