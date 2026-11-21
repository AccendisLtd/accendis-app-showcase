import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { HomeView } from "@/components/home/HomeView";
import { siteQuery } from "@/lib/content/public.functions";
import { toShowcaseApp } from "@/lib/content/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accendis — Apps for personal, home, work and business" },
      {
        name: "description",
        content:
          "Explore Accendis apps like Expense organiser, Job search companion, Home routines, Workflow planner and Client enquiries.",
      },
      { property: "og:title", content: "Accendis — Apps for personal, home, work and business" },
      {
        property: "og:description",
        content: "Find the right Accendis app for your role across Personal, Home, Work and Business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">We couldn't load this page.</h1>
      <p className="mt-3 text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p>
    </div>
  ),
});

function HomePage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <HomeView
      home={data.home}
      apps={data.apps.map((a) => toShowcaseApp(a.slug, a.content))}
      roles={data.roles}
      categories={data.categories}
    />
  );
}
