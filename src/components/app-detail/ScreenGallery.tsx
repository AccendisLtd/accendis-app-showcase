import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { GallerySlide } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { useMediaUrl } from "@/lib/content/media";
import { MiniScreen } from "./MiniScreen";

/** Swipeable strip of app screens: one per view on phones, two on tablets, three on desktop. */
export function ScreenGallery({ label, slides }: { label: string; slides: GallerySlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSnapCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <section
      aria-label={label}
      className="rounded-2xl border border-business-edge bg-card px-12 pb-5 pt-6 sm:px-14"
    >
      <Carousel setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent>
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="sm:basis-1/2 lg:basis-1/3">
              <Slide slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-10 border-transparent text-primary shadow-none sm:-left-11" />
        <CarouselNext className="-right-10 border-transparent text-primary shadow-none sm:-right-11" />
      </Carousel>

      {snapCount > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: snapCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selected}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "size-2.5 rounded-full transition-colors",
                i === selected ? "bg-primary" : "bg-primary/25 hover:bg-primary/40",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Slide({ slide }: { slide: GallerySlide }) {
  const url = useMediaUrl(slide.image);
  if (!url) return <MiniScreen slide={slide} />;
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <img src={url} alt={slide.image?.alt || slide.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      {slide.title && <figcaption className="px-3 py-2 text-xs font-semibold text-heading-accent">{slide.title}</figcaption>}
    </figure>
  );
}
