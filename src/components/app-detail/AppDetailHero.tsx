import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import defaultHeroImage from "@/assets/app-detail-hero.jpg";
import { CATEGORY_STYLES } from "@/components/home/category-styles";
import { Button } from "@/components/ui/button";
import type { Category } from "@/data/apps";
import { useMediaUrl } from "@/lib/content/media";
import { isSafeUrl, type AppContent, type CtaLink } from "@/lib/content/types";
import { cn } from "@/lib/utils";

function CtaButton({ cta, className, variant, children }: { cta: CtaLink; className: string; variant?: "outline"; children: ReactNode }) {
  if (!cta.label) return null;
  if (isSafeUrl(cta.url)) {
    const external = /^https?:/i.test(cta.url);
    return (
      <Button asChild variant={variant} className={className}>
        <a href={cta.url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      </Button>
    );
  }
  return (
    <Button variant={variant} className={className}>
      {children}
    </Button>
  );
}

const ON_SCRIM_BTN =
  "rounded-lg border-on-scrim bg-on-scrim px-6 text-base font-semibold text-primary hover:bg-on-scrim/90 hover:text-primary";

/** Photo hero with the app name, two actions and a call-to-action strip in the app's category colour. */
export function AppDetailHero({ content, categories }: { content: AppContent; categories: Category[] }) {
  const { hero, banner } = content;
  const categoryName = categories.find((c) => c.id === content.category)?.name;
  const heroUrl = useMediaUrl(hero.image) ?? defaultHeroImage;

  return (
    <section aria-labelledby="app-title" className="overflow-hidden rounded-2xl shadow-soft">
      <div className="relative isolate flex min-h-[22rem] items-end sm:min-h-[26rem] lg:min-h-[30rem]">
        <img
          src={heroUrl}
          alt={hero.image?.alt ?? ""}
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
            <span aria-hidden="true" className={cn("size-2.5 rounded-full", CATEGORY_STYLES[content.category].dot)} />
            {categoryName}
          </span>
          <h1 id="app-title" className="mt-4 font-display text-4xl leading-[1.02] text-on-scrim sm:text-5xl lg:text-6xl">
            {content.name}
          </h1>
          <p className="mt-4 max-w-md text-base text-on-scrim/85 sm:text-lg">{hero.tagline}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CtaButton cta={hero.primaryCta} className="h-12 rounded-lg px-6 text-base font-semibold">
              {hero.primaryCta.label}
              <ArrowRight />
            </CtaButton>
            <CtaButton cta={hero.secondaryCta} variant="outline" className={cn("h-12", ON_SCRIM_BTN)}>
              {hero.secondaryCta.label}
            </CtaButton>
          </div>
        </div>
      </div>

      {(banner.text || banner.cta.label) && (
        <div
          data-category={content.category}
          className={cn(
            "flex flex-col items-start gap-4 px-7 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12",
            CATEGORY_STYLES[content.category].banner,
          )}
        >
          <p className="text-lg font-bold text-on-scrim">{banner.text}</p>
          <CtaButton cta={banner.cta} variant="outline" className={cn("h-11 w-full shrink-0 sm:w-auto", ON_SCRIM_BTN)}>
            {banner.cta.label}
          </CtaButton>
        </div>
      )}
    </section>
  );
}
