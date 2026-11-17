import { ArrowUpRight } from "lucide-react";

import type { ShowcaseApp } from "@/data/apps";
import type { CardSpan } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import { AppPreviewPanel } from "./AppPreviewPanel";
import { CATEGORY_STYLES } from "./category-styles";

interface AppCardProps {
  app: ShowcaseApp;
  span: CardSpan;
  /** Stretch across both tablet columns (used for an odd last card). */
  fullOnTablet?: boolean;
}

const SPAN_CLASS: Record<CardSpan, string> = {
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  12: "lg:col-span-12",
};

export function AppCard({ app, span, fullOnTablet }: AppCardProps) {
  // Wider cards put the preview beside the copy on desktop; narrow cards stack it below.
  const sideBySide = span >= 5;
  const isWide = span >= 7;

  return (
    <article
      className={cn(
        "group flex flex-col gap-6 rounded-2xl border p-7 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2 hover:-translate-y-0.5 hover:shadow-lift sm:p-8",
        CATEGORY_STYLES[app.category].surface,
        SPAN_CLASS[span],
        fullOnTablet && "md:col-span-2",
        sideBySide && "lg:flex-row lg:items-center lg:gap-8",
      )}
    >
      <div className={cn("min-w-0", sideBySide && "lg:flex-1")}>
        <h3
          className={cn(
            "font-display text-[1.75rem] leading-[1.05] sm:text-3xl",
            !isWide && "max-w-[11ch]",
          )}
        >
          {app.name}
        </h3>
        <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base">
          {app.description}
        </p>
        <a
          href={`#${app.id}`}
          className="mt-5 inline-flex items-center gap-1.5 text-[1.05rem] font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          {app.ctaLabel}
          <ArrowUpRight className="size-[18px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.25} />
        </a>
      </div>

      <AppPreviewPanel
        preview={app.preview}
        className={cn("mt-auto w-full", sideBySide && "lg:mt-0", sideBySide && (isWide ? "lg:w-56" : "lg:w-40 lg:shrink-0"), isWide && "lg:shrink-0")}
      />
    </article>
  );
}
