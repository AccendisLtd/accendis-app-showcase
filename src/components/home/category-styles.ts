import type { CategoryId } from "@/data/apps";

/** Literal class names per category so Tailwind can see them at build time. */
export const CATEGORY_STYLES: Record<CategoryId, { dot: string; surface: string; banner: string }> = {
  personal: {
    dot: "bg-personal",
    surface: "bg-personal-soft border-personal-edge",
    banner: "bg-personal-strong",
  },
  home: {
    dot: "bg-home",
    surface: "bg-home-soft border-home-edge",
    banner: "bg-home-strong",
  },
  work: {
    dot: "bg-work",
    surface: "bg-work-soft border-work-edge",
    banner: "bg-work-strong",
  },
  business: {
    dot: "bg-business",
    surface: "bg-business-soft border-business-edge",
    banner: "bg-business-strong",
  },
};
