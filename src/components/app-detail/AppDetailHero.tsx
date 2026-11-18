import { ArrowRight } from "lucide-react";

import heroImage from "@/assets/app-detail-hero.jpg";
import { CATEGORY_STYLES } from "@/components/home/category-styles";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/apps";
import type { AppDetail } from "@/data/app-details";
import { cn } from "@/lib/utils";

/** Photo hero with the app name, two actions and an orange call-to-action strip. */
export function AppDetailHero({ detail }: { detail: AppDetail }) {
  const { app, hero, banner } = detail;
  const categoryName = CATEGORIES.find((c) => c.id === app.category)?.name;

  return (
    <section aria-labelledby="app-title" className="overflow-hidden rounded-2xl shadow-soft">
      <div className="relative isolate flex min-h-[22rem] items-end sm:min-h-[26rem] lg:min-h-[30rem]">
        <img
          src={heroImage}
          alt=""
          width={1920}
          height={800}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-scrim/85 via-scrim/45 to-scrim/10 sm:bg-gradient-to-r sm:from-scrim/80 sm:via-scrim/40 sm:to-transparent"
        />

        <div className="w-full max-w-2xl p-7 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-on-scrim/15 px-3 py-1 text-sm font-medium text-on-scrim backdrop-blur-sm">
            <span
              aria-hidden="true"
              className={cn("size-2.5 rounded-full", CATEGORY_STYLES[app.category].dot)}
            />
            {categoryName}
          </span>
          <h1
            id="app-title"
            className="mt-4 font-display text-4xl leading-[1.02] text-on-scrim sm:text-5xl lg:text-6xl"
          >
            {app.name}
          </h1>
          <p className="mt-4 max-w-md text-base text-on-scrim/85 sm:text-lg">{hero.tagline}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button className="h-12 rounded-lg px-6 text-base font-semibold">
              {hero.primaryCta}
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-lg border-on-scrim bg-on-scrim px-6 text-base font-semibold text-primary hover:bg-on-scrim/90 hover:text-primary"
            >
              {hero.secondaryCta}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 bg-brand-orange-strong px-7 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
        <p className="text-lg font-bold text-on-scrim">{banner.text}</p>
        <Button
          variant="outline"
          className="h-11 w-full shrink-0 rounded-lg border-on-scrim bg-on-scrim px-6 text-base font-semibold text-primary hover:bg-on-scrim/90 hover:text-primary sm:w-auto"
        >
          {banner.ctaLabel}
        </Button>
      </div>
    </section>
  );
}
