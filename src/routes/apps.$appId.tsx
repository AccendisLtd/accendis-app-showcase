import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppDetailHero } from "@/components/app-detail/AppDetailHero";
import { AppSummaryCard } from "@/components/app-detail/AppSummaryCard";
import { DetailBody } from "@/components/app-detail/DetailBody";
import { AccendisLogo } from "@/components/brand/AccendisLogo";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getAppDetail } from "@/data/app-details";

export const Route = createFileRoute("/apps/$appId")({
  loader: ({ params }) => {
    const detail = getAppDetail(params.appId);
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "App not found — Accendis" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.app.name} — Accendis`;
    const description = `${loaderData.app.name}: ${loaderData.hero.tagline}`;
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
  const detail = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background">
      <PageTop />

      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        <AppDetailHero detail={detail} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:px-10 lg:pt-20">
        <aside className="md:order-last md:sticky md:top-8 md:self-start">
          <AppSummaryCard detail={detail} />
        </aside>
        <article className="min-w-0 max-w-2xl">
          <DetailBody blocks={detail.body} />
        </article>
      </div>

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
