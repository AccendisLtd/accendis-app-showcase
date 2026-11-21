import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppDetailView } from "@/components/app-detail/AppDetailView";
import { AccendisLogo } from "@/components/brand/AccendisLogo";
import { SiteFooter } from "@/components/home/SiteFooter";
import { appQuery } from "@/lib/content/public.functions";

export const Route = createFileRoute("/apps/$appId")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(appQuery(params.appId));
    if (!detail) throw notFound();
    return { name: detail.content.name, tagline: detail.content.hero.tagline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "App not found — Accendis" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Accendis`;
    const description = `${loaderData.name}: ${loaderData.tagline}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: AppDetailPage,
  notFoundComponent: AppNotFound,
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">We couldn't load this app.</h1>
      <p className="mt-3 text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p>
    </div>
  ),
});

function PageTop() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pb-8 pt-8 sm:px-8 lg:px-10">
      <Link to="/" aria-label="Accendis home" className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <AccendisLogo />
      </Link>
      <Link
        to="/"
        hash="apps"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-[0.95rem] font-semibold text-foreground/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" />
        All apps
      </Link>
    </div>
  );
}

function AppDetailPage() {
  const { appId } = Route.useParams();
  const { data } = useSuspenseQuery(appQuery(appId));
  if (!data) return <AppNotFound />;

  return (
    <main className="min-h-screen bg-background">
      <PageTop />
      <AppDetailView content={data.content} roles={data.roles} categories={data.categories} />
      <SiteFooter />
    </main>
  );
}

function AppNotFound() {
  return (
    <main className="min-h-screen bg-background">
      <PageTop />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-8">
        <h1 className="font-display text-4xl sm:text-5xl">Lorem ipsum dolor.</h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <Link
          to="/"
          hash="apps"
          className="mt-8 inline-flex items-center gap-1.5 text-[1.05rem] font-bold text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-[18px]" />
          All apps
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
