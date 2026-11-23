import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { AppDetailView } from "@/components/app-detail/AppDetailView";
import { HomeView } from "@/components/home/HomeView";
import { SiteFooter } from "@/components/home/SiteFooter";
import { categoriesQuery, itemQuery, itemsQuery, rolesQuery, signMedia } from "@/lib/admin/api";
import { MediaProvider } from "@/lib/content/media";
import { collectMediaPaths, normalizeApp, normalizeHome, toShowcaseApp } from "@/lib/content/types";

export const Route = createFileRoute("/_authenticated/admin_/preview/$id")({
  loader: async ({ context, params }) => {
    const [row] = await Promise.all([
      context.queryClient.ensureQueryData(itemQuery(params.id)),
      context.queryClient.ensureQueryData(rolesQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(itemsQuery("app")),
    ]);
    if (!row) throw notFound();
  },
  notFoundComponent: () => <p className="p-10 text-center">This draft doesn't exist, or your account can't view drafts.</p>,
  head: () => ({ meta: [{ title: "Preview — Accendis" }, { name: "robots", content: "noindex" }] }),
  component: Preview,
});

/** Private draft preview: renders the public templates with draft content and signed media URLs. */
function Preview() {
  const { id } = Route.useParams();
  const { data: row } = useSuspenseQuery(itemQuery(id));
  const { data: roles } = useSuspenseQuery(rolesQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: apps } = useSuspenseQuery(itemsQuery("app"));
  const paths = row?.kind === "app" ? collectMediaPaths(row.draft) : collectMediaPaths(apps.map((a) => a.draft));
  const { data: urls } = useQuery({ queryKey: ["admin", "signed", paths], queryFn: () => signMedia(paths), staleTime: 30 * 60_000 });
  if (!row) return null;
  const activeRoles = roles.filter((r) => r.is_active);

  return (
    <MediaProvider resolve={(p) => urls?.[p]}>
      <div className="sticky top-0 z-50 bg-scrim px-4 py-2 text-center text-sm font-semibold text-on-scrim">
        Private preview — visitors can't see this draft.
      </div>
      {row.kind === "app" ? (
        <main className="min-h-screen bg-background pt-8">
          <AppDetailView content={normalizeApp(row.draft)} roles={activeRoles} categories={categories} />
          <SiteFooter />
        </main>
      ) : (
        <HomeView
          home={normalizeHome(row.draft)}
          apps={apps.filter((a) => a.status === "published").map((a) => toShowcaseApp(a.slug, normalizeApp(a.draft)))}
          roles={activeRoles}
          categories={categories}
        />
      )}
    </MediaProvider>
  );
}
