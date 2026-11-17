import { CalendarDays, CheckCircle2, Circle, FileText, Mail } from "lucide-react";

import type { AppPreview } from "@/data/apps";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

/** Small mock UI panel shown inside each app card. */
export function AppPreviewPanel({ preview, className }: { preview: AppPreview; className?: string }) {
  return (
    <ul
      className={cn(
        "divide-y divide-border rounded-xl border border-border/70 bg-card px-4 text-[0.8rem] text-card-foreground shadow-soft",
        className,
      )}
    >
      {preview.kind === "ledger" &&
        preview.rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3 py-2.5">
            <FileText className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="min-w-0 flex-1 truncate">{row.label}</span>
            <span className="tabular-nums">{currency.format(row.amount)}</span>
          </li>
        ))}
      {preview.kind === "checklist" &&
        preview.rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3 py-2.5">
            {row.done ? (
              <CheckCircle2 className="size-[18px] shrink-0 fill-success text-card" strokeWidth={2.25} />
            ) : (
              <Circle className="size-[18px] shrink-0 text-muted-foreground/60" strokeWidth={1.5} />
            )}
            <span className="min-w-0 truncate">{row.label}</span>
          </li>
        ))}
      {(preview.kind === "schedule" || preview.kind === "inbox") &&
        preview.rows.map((row) => {
          const Icon = preview.kind === "schedule" ? CalendarDays : Mail;
          return (
            <li key={row.label} className="flex items-center gap-3 py-2.5">
              <Icon className="size-4 shrink-0 text-foreground/70" strokeWidth={1.75} />
              <span className="min-w-0 truncate">{row.label}</span>
            </li>
          );
        })}
    </ul>
  );
}
