import { describe, expect, it } from "vitest";

import { APPS } from "./apps";
import { getAppDetail } from "./app-details";

describe("app detail pages", () => {
  it("every showcase app has a detail page", () => {
    for (const app of APPS) {
      expect(getAppDetail(app.id)?.app.name).toBe(app.name);
    }
  });

  it("an unknown app has no detail page", () => {
    expect(getAppDetail("not-an-app")).toBeUndefined();
  });
});
