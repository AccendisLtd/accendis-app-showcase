import type * as React from "react";
import type { Transparency } from "@/lib/content/types";

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</dt>
      <dd className="mt-2 text-[0.98rem] text-foreground/85">{children}</dd>
    </div>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((x, i) => (
      <li key={i} className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium">
        {x}
      </li>
    ))}
  </ul>
);

/** Plain-spoken facts about what the app runs on, connects to, costs, can't do, and how to build it yourself. */
export function TransparencyPanel({ data }: { data: Transparency }) {
  const empty =
    !data.platforms.length && !data.integrations.length && !data.costs && !data.limitations.length && !data.diy;
  if (empty) return null;
  return (
    <section aria-labelledby="transparency-heading" className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 id="transparency-heading" className="font-display text-2xl leading-tight text-heading-accent sm:text-[1.75rem]">
        The honest details
      </h2>
      <dl className="mt-5 divide-y divide-border">
        {data.platforms.length > 0 && <Row title="Platforms"><List items={data.platforms} /></Row>}
        {data.integrations.length > 0 && <Row title="Integrations"><List items={data.integrations} /></Row>}
        {data.costs && <Row title="Costs"><p className="whitespace-pre-line">{data.costs}</p></Row>}
        {data.limitations.length > 0 && (
          <Row title="Limitations">
            <ul className="list-disc space-y-1 pl-5">{data.limitations.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </Row>
        )}
        {data.diy && <Row title="Do it yourself"><p className="whitespace-pre-line">{data.diy}</p></Row>}
      </dl>
    </section>
  );
}
