/**
 * Shared showcase types. Content itself lives in Supabase (see src/lib/content);
 * category ids are fixed in code because each one maps to its own colour tokens.
 */

export type CategoryId = "personal" | "home" | "work" | "business";
export type CategoryFilter = "all" | CategoryId;
export type RoleId = string;

export interface Category {
  id: CategoryId;
  name: string;
}

export interface Role {
  id: RoleId;
  name: string;
}

export interface MediaRef {
  /** Object path inside the private `media` storage bucket. */
  path: string;
  alt?: string;
}

export type AppPreview =
  | { kind: "ledger"; rows: { label: string; amount: number }[] }
  | { kind: "checklist"; rows: { label: string; done: boolean }[] }
  | { kind: "schedule"; rows: { label: string }[] }
  | { kind: "inbox"; rows: { label: string }[] };

export interface ShowcaseApp {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  ctaLabel: string;
  roles: RoleId[];
  preview: AppPreview;
  appUrl?: string;
  cardImage?: MediaRef | null;
}

export const CATEGORY_IDS: CategoryId[] = ["personal", "home", "work", "business"];

export const CATEGORIES: Category[] = [
  { id: "personal", name: "Personal" },
  { id: "home", name: "Home" },
  { id: "work", name: "Work" },
  { id: "business", name: "Business" },
];

export function categoryFilters(categories: Category[]): { id: CategoryFilter; name: string }[] {
  return [{ id: "all", name: "All" }, ...categories];
}
