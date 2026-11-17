/**
 * Local sample data for the homepage showcase.
 * Swap this module for a real data source later; components only depend on the types.
 */

export type CategoryId = "personal" | "home" | "work" | "business";
export type CategoryFilter = "all" | CategoryId;

export type RoleId =
  | "lorem-ipsum"
  | "dolor-sit"
  | "amet-consectetur"
  | "adipiscing-elit"
  | "sed-eiusmod"
  | "tempor-incididunt";

export interface Category {
  id: CategoryId;
  name: string;
}

export interface Role {
  id: RoleId;
  name: string;
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
}

export const CATEGORIES: Category[] = [
  { id: "personal", name: "Personal" },
  { id: "home", name: "Home" },
  { id: "work", name: "Work" },
  { id: "business", name: "Business" },
];

export const CATEGORY_FILTERS: { id: CategoryFilter; name: string }[] = [
  { id: "all", name: "All" },
  ...CATEGORIES,
];

export const ROLES: Role[] = [
  { id: "lorem-ipsum", name: "Ipsum dolor" },
  { id: "dolor-sit", name: "Dolor sit" },
  { id: "amet-consectetur", name: "Amet consectetur" },
  { id: "adipiscing-elit", name: "Adipiscing elit" },
  { id: "sed-eiusmod", name: "Sed eiusmod" },
  { id: "tempor-incididunt", name: "Tempor incididunt" },
];

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const APPS: ShowcaseApp[] = [
  {
    id: "expense-organiser",
    name: "Expense organiser",
    category: "business",
    description: LOREM,
    ctaLabel: "Lorem ipsum",
    roles: ["adipiscing-elit", "tempor-incididunt", "dolor-sit", "lorem-ipsum"],
    preview: {
      kind: "ledger",
      rows: [
        { label: "Lorem ipsum", amount: 24.6 },
        { label: "Dolor sit amet", amount: 38.9 },
        { label: "Consectetur elit", amount: 12.99 },
      ],
    },
  },
  {
    id: "job-search-companion",
    name: "Job search companion",
    category: "personal",
    description: LOREM,
    ctaLabel: "Lorem ipsum",
    roles: ["amet-consectetur", "lorem-ipsum"],
    preview: {
      kind: "checklist",
      rows: [
        { label: "Lorem ipsum", done: true },
        { label: "Dolor sit amet", done: false },
        { label: "Consectetur elit", done: false },
      ],
    },
  },
  {
    id: "home-routines",
    name: "Home routines",
    category: "home",
    description: LOREM,
    ctaLabel: "Lorem ipsum",
    roles: ["dolor-sit", "lorem-ipsum"],
    preview: {
      kind: "checklist",
      rows: [
        { label: "Lorem ipsum", done: true },
        { label: "Dolor sit amet", done: false },
      ],
    },
  },
  {
    id: "workflow-planner",
    name: "Workflow planner",
    category: "work",
    description: LOREM,
    ctaLabel: "Lorem ipsum",
    roles: ["sed-eiusmod", "adipiscing-elit"],
    preview: {
      kind: "schedule",
      rows: [{ label: "Lorem ipsum" }, { label: "Dolor sit amet" }],
    },
  },
  {
    id: "client-enquiries",
    name: "Client enquiries",
    category: "business",
    description: LOREM,
    ctaLabel: "Lorem ipsum",
    roles: ["tempor-incididunt", "adipiscing-elit"],
    preview: {
      kind: "inbox",
      rows: [{ label: "Lorem ipsum" }, { label: "Dolor sit amet" }],
    },
  },
];
