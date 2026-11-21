/**
 * Admin data access from the browser with the signed-in user's session.
 * Every read and write is enforced by Supabase RLS / storage policies (admins only);
 * the UI checks are for friendliness, not security.
 */
import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { CATEGORIES, type Category } from "@/data/apps";

export type ContentStatus = "draft" | "published" | "archived";

export interface ContentRow {
  id: string;
  kind: string;
  slug: string;
  status: ContentStatus;
  draft: unknown;
  sort_order: number;
  has_unpublished_changes: boolean;
  updated_at: string;
  published_at: string | null;
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export async function fetchIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}

const COLS = "id,kind,slug,status,draft,sort_order,has_unpublished_changes,updated_at,published_at";

export const itemsQuery = (kind: "app" | "homepage") =>
  queryOptions({
    queryKey: ["admin", "items", kind],
    queryFn: async () =>
      check(await supabase.from("content_items").select(COLS).eq("kind", kind).order("sort_order")) as ContentRow[],
  });

export const itemQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin", "item", id],
    queryFn: async () => check(await supabase.from("content_items").select(COLS).eq("id", id).maybeSingle()) as ContentRow | null,
  });

export const homeItemQuery = queryOptions({
  queryKey: ["admin", "home"],
  queryFn: async () =>
    check(await supabase.from("content_items").select(COLS).eq("kind", "homepage").eq("slug", "home").maybeSingle()) as ContentRow | null,
});

export const rolesQuery = queryOptions({
  queryKey: ["admin", "roles"],
  queryFn: async () => check(await supabase.from("roles").select("id,name,sort_order,is_active").order("sort_order")),
});

export const categoriesQuery = queryOptions({
  queryKey: ["admin", "categories"],
  queryFn: async (): Promise<Category[]> => {
    const rows = check(await supabase.from("categories").select("id,name"));
    return CATEGORIES.map((c) => ({ id: c.id, name: rows.find((r) => r.id === c.id)?.name ?? c.name }));
  },
});

export async function createItem(kind: "app" | "homepage", slug: string, draft: unknown, sortOrder = 0) {
  const { data: user } = await supabase.auth.getUser();
  return check(
    await supabase
      .from("content_items")
      .insert({ kind, slug, draft: draft as Json, sort_order: sortOrder, created_by: user.user?.id ?? null })
      .select("id")
      .single(),
  );
}

export async function saveDraft(id: string, patch: { draft: unknown; slug?: string; sort_order?: number }) {
  check(
    await supabase
      .from("content_items")
      .update({ draft: patch.draft as Json, ...(patch.slug ? { slug: patch.slug } : {}), ...(patch.sort_order !== undefined ? { sort_order: patch.sort_order } : {}) })
      .eq("id", id)
      .select("id")
      .single(),
  );
}

export async function publishItem(id: string) {
  check(await supabase.rpc("publish_content", { _id: id }));
}

export async function unpublishItem(id: string, archive = false) {
  check(await supabase.rpc("unpublish_content", { _id: id, _archive: archive }));
}

export async function deleteItem(id: string) {
  check(await supabase.from("content_items").delete().eq("id", id));
}

export async function upsertRole(role: { id: string; name: string; sort_order: number; is_active: boolean }) {
  check(await supabase.from("roles").upsert(role));
}

export async function deleteRole(id: string) {
  check(await supabase.from("roles").delete().eq("id", id));
}

export async function renameCategory(id: string, name: string) {
  check(await supabase.from("categories").update({ name }).eq("id", id));
}

const MAX_BYTES = 50 * 1024 * 1024;

/** Uploads into the private media bucket; files only become public once published content references them. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("Files must be 50 MB or smaller");
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "").slice(-80);
  const path = `${folder}/${crypto.randomUUID()}-${safe || "file"}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function signMedia(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {};
  const { data, error } = await supabase.storage.from("media").createSignedUrls(paths, 3600);
  if (error) throw new Error(error.message);
  const out: Record<string, string> = {};
  for (const row of data) if (row.path && row.signedUrl) out[row.path] = row.signedUrl;
  return out;
}
