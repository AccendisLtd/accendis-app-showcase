import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isSafeUrl, type HomeContent } from "@/lib/content/types";

export function ClosingCta({
  content,
  onAction,
}: {
  content: HomeContent["closing"];
  onAction: () => void;
}) {
  const label = (
    <>
      {content.cta.label}
      <ArrowRight />
    </>
  );
  return (
    <section className="mx-auto max-w-3xl px-6 pb-10 pt-8 text-center sm:px-8 sm:pt-12">
      <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-[2.6rem]">
        {content.heading}
      </h2>
      <p className="mt-3 text-base text-muted-foreground sm:text-lg">{content.text}</p>
      {isSafeUrl(content.cta.url) ? (
        <Button asChild className="mt-6 h-12 rounded-lg px-8 text-base font-semibold">
          <a href={content.cta.url}>{label}</a>
        </Button>
      ) : (
        <Button onClick={onAction} className="mt-6 h-12 rounded-lg px-8 text-base font-semibold">
          {label}
        </Button>
      )}
    </section>
  );
}
