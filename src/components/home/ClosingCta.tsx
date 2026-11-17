import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ClosingCta({ onAction }: { onAction: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-10 pt-8 text-center sm:px-8 sm:pt-12">
      <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-[2.6rem]">
        Lorem ipsum dolor sit amet.
      </h2>
      <p className="mt-3 text-base text-muted-foreground sm:text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
      <Button onClick={onAction} className="mt-6 h-12 rounded-lg px-8 text-base font-semibold">
        Lorem ipsum
        <ArrowRight />
      </Button>
    </section>
  );
}
