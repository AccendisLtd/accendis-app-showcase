import { describe, expect, it } from "vitest";

import { CATEGORY_STYLES } from "@/components/home/category-styles";
import { collectMediaPaths, isSafeUrl, moveItem, normalizeApp, toEmbedUrl } from "./types";

describe("content model", () => {
  it("story CTA strip uses each category's own colour", () => {
    expect(CATEGORY_STYLES.personal.banner).toBe("bg-personal-strong");
    expect(CATEGORY_STYLES.home.banner).toBe("bg-home-strong");
    expect(CATEGORY_STYLES.work.banner).toBe("bg-work-strong");
    expect(CATEGORY_STYLES.business.banner).toBe("bg-business-strong");
  });
  it("blocks can be reordered", () => {
    expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });
  it("legacy bullets/steps blocks become lists and unknown blocks are dropped", () => {
    const app = normalizeApp({ body: [{ type: "steps", items: ["x"] }, { type: "nope" }] });
    expect(app.body).toEqual([{ id: "block-0", type: "list", style: "steps", items: ["x"] }]);
  });
  it("an unknown category falls back to personal", () => {
    expect(normalizeApp({ category: "x" }).category).toBe("personal");
  });
  it("collects every media path so published media can be made readable", () => {
    expect(collectMediaPaths({ cardImage: { path: "a.jpg" }, body: [{ file: { path: "b.mp4" } }] }).sort()).toEqual(["a.jpg", "b.mp4"]);
  });
  it("blocks javascript: links", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("https://x.com")).toBe(true);
  });
  it("turns YouTube links into embeds", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=abc")).toBe("https://www.youtube-nocookie.com/embed/abc");
  });
});
