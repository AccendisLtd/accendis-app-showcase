import { cn } from "@/lib/utils";

interface AccendisLogoProps {
  className?: string;
  size?: "sm" | "md";
}

/** Accendis wordmark: blue and orange swoosh followed by the lowercase name. */
export function AccendisLogo({ className, size = "md" }: AccendisLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-foreground",
        size === "md" ? "text-2xl sm:text-[1.7rem]" : "text-lg",
        className,
      )}
    >
      <AccendisMark className={size === "md" ? "h-5 w-12" : "h-4 w-9"} />
      <span className="leading-none tracking-[-0.03em]">accendis</span>
    </span>
  );
}

export function AccendisMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 22" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.5 15.5C8 7.5 15.5 6.5 23.5 13"
        className="stroke-brand-blue"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M21 14.5C29 20.5 39.5 18 49.5 5.5"
        className="stroke-brand-orange"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
