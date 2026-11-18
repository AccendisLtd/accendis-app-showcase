import { Maximize, PictureInPicture2, Play } from "lucide-react";

/** Static video placeholder: a mock app window with a play button and player controls. */
export function VideoPreview({ title }: { title: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-business-edge bg-business-soft">
      <div className="relative aspect-video p-4 sm:p-7">
        <div className="flex h-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-soft">
          <div className="hidden w-1/4 flex-col gap-3 bg-primary/15 p-4 min-[420px]:flex">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-primary/60" />
              ))}
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="mt-2 flex items-center gap-2">
                <span className="size-3 shrink-0 rounded-full bg-card" />
                <span className="h-1.5 flex-1 rounded-full bg-card" />
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-display text-sm text-heading-accent sm:text-base">
                {title}
              </span>
              <span className="h-3 w-12 shrink-0 rounded bg-primary/70 sm:h-4 sm:w-16" />
            </div>
            <span className="mt-4 h-2 w-2/3 rounded-full bg-muted" />
            <span className="mt-2 h-2 w-1/2 rounded-full bg-muted" />
            <div className="mt-auto grid grid-cols-3 gap-2 sm:gap-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-8 rounded-md bg-business-soft sm:h-14" />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Play ${title} video`}
          className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-scrim/75 text-on-scrim shadow-lift transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:size-16"
        >
          <Play className="ml-1 size-6 fill-current sm:size-7" />
        </button>
      </div>

      <div
        aria-hidden="true"
        className="flex items-center gap-3 bg-scrim/85 px-4 py-2.5 text-on-scrim sm:gap-4"
      >
        <Play className="size-4 fill-current" />
        <span className="relative h-1 flex-1 rounded-full bg-on-scrim/30">
          <span className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-on-scrim" />
          <span className="absolute left-1/4 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-scrim" />
        </span>
        <span className="text-xs tabular-nums text-on-scrim/80">0:42 / 2:48</span>
        <PictureInPicture2 className="hidden size-4 sm:block" />
        <Maximize className="size-4" />
      </div>
    </figure>
  );
}
