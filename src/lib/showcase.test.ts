import { describe, expect, it } from "vitest";

import { CATEGORIES, categoryFilters } from "@/data/apps";
import { APPS } from "@/test/fixtures";
import { filterApps, getCardSpans } from "@/lib/showcase";

const names = (category: Parameters<typeof filterApps>[1]["category"], role: Parameters<typeof filterApps>[1]["role"] = null) =>
  filterApps(APPS, { category, role }).map((a) => a.name);

describe("showcase filters", () => {
  it("offers All, Personal, Home, Work and Business filters in that order", () => {
    expect(categoryFilters(CATEGORIES).map((f) => f.name)).toEqual(["All", "Personal", "Home", "Work", "Business"]);
  });

  it("All with no role shows every app", () => {
    expect(names("all")).toHaveLength(APPS.length);
  });

  it("a category filter shows only that category's apps", () => {
    expect(names("business")).toEqual(["Expense organiser", "Client enquiries"]);
    expect(names("home")).toEqual(["Home routines"]);
  });

  it("the role dropdown narrows results to apps for that role", () => {
    expect(names("all", "amet-consectetur")).toEqual(["Job search companion"]);
  });

  it("category and role combine", () => {
    expect(names("business", "adipiscing-elit")).toEqual(["Expense organiser", "Client enquiries"]);
    expect(names("work", "dolor-sit")).toEqual([]);
  });
});

describe("card layout", () => {
  it("lays five cards out as a wide pair then a trio", () => {
    expect(getCardSpans(5)).toEqual([7, 5, 4, 4, 4]);
  });

  it("a single result fills the row", () => {
    expect(getCardSpans(1)).toEqual([12]);
  });

  it("every row fills all 12 columns", () => {
    for (let n = 1; n <= 12; n++) {
      const total = getCardSpans(n).reduce((a, b) => a + b, 0);
      expect(total % 12).toBe(0);
    }
  });
});
