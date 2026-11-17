import { X } from "lucide-react";
import { forwardRef } from "react";

import { ROLES, type CategoryFilter, type RoleId, type ShowcaseApp } from "@/data/apps";
import { getCardSpans } from "@/lib/showcase";
import { AppCard } from "./AppCard";
import { CategoryFilterBar } from "./CategoryFilterBar";

interface AppShowcaseProps {
  apps: ShowcaseApp[];
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  role: RoleId | null;
  onClearRole: () => void;
  onReset: () => void;
}

export const AppShowcase = forwardRef<HTMLElement, AppShowcaseProps>(function AppShowcase(
  { apps, category, onCategoryChange, role, onClearRole, onReset },
  ref,
) {
  const spans = getCardSpans(apps.length);
  const roleName = ROLES.find((r) => r.id === role)?.name;
  const filterKey = `${category}-${role ?? "any"}`;

  return (
    <section
      ref={ref}
      id="apps"
      aria-labelledby="apps-heading"
      className="mx-auto max-w-6xl scroll-mt-8 px-6 py-16 sm:px-8 sm:py-24 lg:px-10"
    >
      <h2 id="apps-heading" className="font-display text-3xl leading-tight sm:text-4xl lg:text-[2.6rem]">
        Lorem ipsum dolor sit amet.
      </h2>

      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CategoryFilterBar value={category} onChange={onCategoryChange} />
        {roleName && (
          <button
            type="button"
            onClick={onClearRole}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-muted"
            aria-label={`Clear role ${roleName}`}
          >
            {roleName}
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {apps.length} apps shown
      </p>

      {apps.length > 0 ? (
        <div key={filterKey} className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {apps.map((app, i) => (
            <AppCard
              key={app.id}
              app={app}
              span={spans[i] ?? 12}
              fullOnTablet={apps.length % 2 === 1 && i === apps.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-input px-6 py-16 text-center">
          <p className="font-display text-2xl">Lorem ipsum dolor.</p>
          <p className="mt-2 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 text-base font-bold text-primary underline-offset-4 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
});
