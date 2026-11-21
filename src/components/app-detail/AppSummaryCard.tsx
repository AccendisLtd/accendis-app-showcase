import { CATEGORY_STYLES } from "@/components/home/category-styles";
import type { Role } from "@/data/apps";
import type { AppContent } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** "At a glance" box: key points and the roles this app suits, tinted with its category colour. */
export function AppSummaryCard({ content, roles: allRoles }: { content: AppContent; roles: Role[] }) {
  const { summary } = content;
  const roles = allRoles.filter((r) => content.roles.includes(r.id));

  return (
    <div className={cn("rounded-2xl border p-6 sm:p-7", CATEGORY_STYLES[content.category].surface)}>
      <h2 className="font-display text-xl text-heading-accent sm:text-2xl">{summary.title}</h2>
      <ul className="mt-4 divide-y divide-foreground/10 text-[0.95rem]">
        {summary.items.map((item, i) => (
          <li key={i} className="py-2.5 first:pt-0">
            {item}
          </li>
        ))}
      </ul>

      {roles.length > 0 && (
        <>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Suited to</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {roles.map((role) => (
              <li key={role.id} className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground">
                {role.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
