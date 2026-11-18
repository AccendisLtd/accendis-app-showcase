import { CATEGORY_STYLES } from "@/components/home/category-styles";
import { ROLES } from "@/data/apps";
import type { AppDetail } from "@/data/app-details";
import { cn } from "@/lib/utils";

/** "At a glance" box: key points and the roles this app suits, tinted with its category colour. */
export function AppSummaryCard({ detail }: { detail: AppDetail }) {
  const { app, summary } = detail;
  const roles = ROLES.filter((r) => app.roles.includes(r.id));

  return (
    <div className={cn("rounded-2xl border p-6 sm:p-7", CATEGORY_STYLES[app.category].surface)}>
      <h2 className="font-display text-xl text-heading-accent sm:text-2xl">{summary.title}</h2>
      <ul className="mt-4 divide-y divide-foreground/10 text-[0.95rem]">
        {summary.items.map((item) => (
          <li key={item} className="py-2.5 first:pt-0">
            {item}
          </li>
        ))}
      </ul>

      {roles.length > 0 && (
        <>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Lorem ipsum
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground"
              >
                {role.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
