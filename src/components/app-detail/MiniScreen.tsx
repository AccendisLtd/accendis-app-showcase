import type { GallerySlide } from "@/lib/content/types";

const BAR_HEIGHTS = ["h-[35%]", "h-[55%]", "h-[45%]", "h-[75%]", "h-[60%]", "h-[90%]"];

/** Tiny illustrative app screen used in the screenshot gallery. */
export function MiniScreen({ slide }: { slide: GallerySlide }) {
  return (
    <div className="flex aspect-[4/3] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="truncate text-[0.7rem] font-semibold text-heading-accent">
          {slide.title}
        </span>
        <span className="h-2 w-8 rounded bg-primary/25" />
      </div>

      <div className="flex min-h-0 flex-1 gap-3 p-3">
        {slide.kind === "list" && (
          <>
            <div className="flex w-1/4 flex-col gap-2 rounded bg-muted p-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-1.5 rounded-full bg-primary/20" />
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-2.5 pt-1">
              {["w-full", "w-4/5", "w-full", "w-3/5", "w-11/12"].map((w, i) => (
                <span key={i} className={`h-1.5 rounded-full bg-muted-foreground/20 ${w}`} />
              ))}
            </div>
          </>
        )}

        {slide.kind === "chart" && (
          <div className="flex flex-1 flex-col">
            <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground/20" />
            <span className="mt-1.5 h-1.5 w-1/3 rounded-full bg-muted-foreground/15" />
            <div className="mt-auto flex h-3/5 items-end justify-center gap-2">
              {BAR_HEIGHTS.map((h, i) => (
                <span key={i} className={`w-4 rounded-t bg-primary/60 ${h}`} />
              ))}
            </div>
          </div>
        )}

        {slide.kind === "table" && (
          <div className="flex flex-1 flex-col gap-2 pt-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-sm border border-muted-foreground/40" />
                <span className="h-1.5 flex-1 rounded-full bg-muted-foreground/20" />
                <span className="h-1.5 w-1/5 rounded-full bg-muted-foreground/15" />
                <span className="h-1.5 w-1/6 rounded-full bg-primary/25" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
