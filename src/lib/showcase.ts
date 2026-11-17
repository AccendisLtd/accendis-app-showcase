import type { CategoryFilter, RoleId, ShowcaseApp } from "@/data/apps";

export interface ShowcaseFilters {
  category: CategoryFilter;
  role: RoleId | null;
}

/** Returns apps matching the selected category and role; "all" / null mean no restriction. */
export function filterApps(apps: ShowcaseApp[], { category, role }: ShowcaseFilters) {
  return apps.filter(
    (app) => (category === "all" || app.category === category) && (!role || app.roles.includes(role)),
  );
}

export type CardSpan = 4 | 5 | 6 | 7 | 12;

/**
 * Desktop bento layout on a 12-column grid: rows alternate between a pair
 * (wide + narrow) and a trio of equal cards, so filtered results stay balanced.
 */
export function getCardSpans(count: number): CardSpan[] {
  const spans: CardSpan[] = [];
  let row = 0;
  while (spans.length < count) {
    const remaining = count - spans.length;
    const isPairRow = row % 2 === 0;
    if (remaining === 1) spans.push(12);
    else if (isPairRow || remaining === 2) spans.push(...((row % 4 === 2 ? [5, 7] : [7, 5]) as CardSpan[]));
    else if (remaining === 4) spans.push(6, 6);
    else spans.push(4, 4, 4);
    row++;
  }
  return spans;
}
