import { useCallback, useMemo, useRef, useState } from "react";

import type { Category, CategoryFilter, Role, RoleId, ShowcaseApp } from "@/data/apps";
import type { HomeContent } from "@/lib/content/types";
import { filterApps } from "@/lib/showcase";
import { AppShowcase } from "./AppShowcase";
import { ClosingCta } from "./ClosingCta";
import { Hero } from "./Hero";
import { SiteFooter } from "./SiteFooter";

/** The homepage layout; owns filter state. Shared by the public page and the admin preview. */
export function HomeView({
  home,
  apps: allApps,
  roles,
  categories,
}: {
  home: HomeContent;
  apps: ShowcaseApp[];
  roles: Role[];
  categories: Category[];
}) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [role, setRole] = useState<RoleId | null>(null);
  const showcaseRef = useRef<HTMLElement>(null);

  const apps = useMemo(() => filterApps(allApps, { category, role }), [allApps, category, role]);

  const scrollToApps = useCallback(() => {
    showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Hero content={home} roles={roles} role={role} onRoleChange={setRole} onExplore={scrollToApps} />
      <AppShowcase
        ref={showcaseRef}
        heading={home.showcaseHeading}
        categories={categories}
        roles={roles}
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
      <ClosingCta content={home.closing} onAction={scrollToApps} />
      <SiteFooter />
    </main>
  );
}
