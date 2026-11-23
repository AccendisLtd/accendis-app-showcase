import type { ShowcaseApp } from "@/data/apps";

const app = (id: string, name: string, category: ShowcaseApp["category"], roles: string[]): ShowcaseApp => ({
  id, name, category, roles, description: "", ctaLabel: "", preview: { kind: "schedule", rows: [] },
});

/** Mirrors the content imported into Supabase. */
export const APPS: ShowcaseApp[] = [
  app("expense-organiser", "Expense organiser", "business", ["adipiscing-elit", "tempor-incididunt", "dolor-sit", "lorem-ipsum"]),
  app("job-search-companion", "Job search companion", "personal", ["amet-consectetur", "lorem-ipsum"]),
  app("home-routines", "Home routines", "home", ["dolor-sit", "lorem-ipsum"]),
  app("workflow-planner", "Workflow planner", "work", ["sed-eiusmod", "adipiscing-elit"]),
  app("client-enquiries", "Client enquiries", "business", ["tempor-incididunt", "adipiscing-elit"]),
];
