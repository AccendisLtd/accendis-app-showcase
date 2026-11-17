import type { CategoryId } from "@/data/apps";

/** Literal class names per category so Tailwind can see them at build time. */
export const CATEGORY_STYLES: Record<CategoryId, { dot: string; surface: string }> = {
  personal: {
    dot: "bg-personal",
    surface: "bg-gradient-to-br from-personal-soft to-background/40 border-personal-edge",
  },
  home: {
    dot: "bg-home",
    surface: "bg-gradient-to-br from-home-soft to-background/40 border-home-edge",
  },
  work: {
    dot: "bg-work",
    surface: "bg-gradient-to-br from-work-soft to-background/40 border-work-edge",
  },
  business: {
    dot: "bg-business",
    surface: "bg-gradient-to-br from-business-soft to-business-soft/40 border-business-edge",
  },
};
