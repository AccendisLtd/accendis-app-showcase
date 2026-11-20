import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { CATEGORIES, type Category, type Role } from "@/data/apps";
import { isCategory, normalizeApp, normalizeHome, type AppContent, type HomeContent } from "./types";

export interface PublishedSite {
  home: HomeContent;
  apps: { slug: string; content: AppContent }[];
  roles: Role[];
  categories: Category[];
}

async function loadCategoriesAndRoles(sb: Awaited<ReturnType<typeof getClient>>) {
  const [cats, roles] = await Promise.all([
    sb.from("categories").select("id,name").order("sort_order"),
    sb.from("roles").select("id,name").eq("is_active", true).order("sort_order"),
  ]);
  if (cats.error) throw new Error(cats.error.message);
  if (roles.error) throw new Error(roles.error.message);
  const categories = CATEGORIES.map((c) => ({
    id: c.id,
    name: cats.data.find((row) => row.id === c.id)?.name ?? c.name,
  })).filter((c) => isCategory(c.id));
  return { categories, roles: roles.data };
}

async function getClient() {
  const { createPublicSupabase } = await import("./public-client.server");
  return createPublicSupabase();
}

export const getPublishedSite = createServerFn({ method: "GET" }).handler(async (): Promise<PublishedSite> => {
  const sb = await getClient();
  const [content, meta] = await Promise.all([
    sb.from("published_content").select("kind,slug,data").order("sort_order"),
    loadCategoriesAndRoles(sb),
  ]);
  if (content.error) throw new Error(content.error.message);
  const homeRow = content.data.find((r) => r.kind === "homepage" && r.slug === "home");
  return {
    home: normalizeHome(homeRow?.data),
    apps: content.data
      .filter((r) => r.kind === "app")
      .map((r) => ({ slug: r.slug, content: normalizeApp(r.data) })),
    ...meta,
  };
});

export const getPublishedApp = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug).slice(0, 80) }))
  .handler(async ({ data }) => {
    const sb = await getClient();
    const [row, meta] = await Promise.all([
      sb.from("published_content").select("slug,data").eq("kind", "app").eq("slug", data.slug).maybeSingle(),
      loadCategoriesAndRoles(sb),
    ]);
    if (row.error) throw new Error(row.error.message);
    if (!row.data) return null;
    return { slug: row.data.slug, content: normalizeApp(row.data.data), ...meta };
  });

export const siteQuery = queryOptions({
  queryKey: ["published-site"],
  queryFn: () => getPublishedSite(),
  staleTime: 30_000,
});

export const appQuery = (slug: string) =>
  queryOptions({
    queryKey: ["published-app", slug],
    queryFn: () => getPublishedApp({ data: { slug } }),
    staleTime: 30_000,
  });
