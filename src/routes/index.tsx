import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";

import { AppShowcase } from "@/components/home/AppShowcase";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Hero } from "@/components/home/Hero";
import { SiteFooter } from "@/components/home/SiteFooter";
import { APPS, type CategoryFilter, type RoleId } from "@/data/apps";
import { filterApps } from "@/lib/showcase";

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
  component: HomePage,
});

function HomePage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [role, setRole] = useState<RoleId | null>(null);
  const showcaseRef = useRef<HTMLElement>(null);

  const apps = useMemo(() => filterApps(APPS, { category, role }), [category, role]);

  const scrollToApps = useCallback(() => {
    showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Hero role={role} onRoleChange={setRole} onExplore={scrollToApps} />
      <AppShowcase
        ref={showcaseRef}
        apps={apps}
        category={category}
        onCategoryChange={setCategory}
        role={role}
        onClearRole={() => setRole(null)}
        onReset={() => {
          setCategory("all");
          setRole(null);
        }}
      />
      <ClosingCta onAction={scrollToApps} />
      <SiteFooter />
    </main>
  );
}
