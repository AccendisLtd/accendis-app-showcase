import { AccendisLogo } from "@/components/brand/AccendisLogo";

export function SiteFooter() {
  return (
    <footer className="relative">
      <FooterWaves />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 pb-8 pt-2 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <AccendisLogo size="sm" />
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Lorem ipsum dolor.</p>
      </div>
    </footer>
  );
}

/** Thin orange and blue lines that fade in and out across the page edge. */
function FooterWaves() {
  return (
    <svg
      viewBox="0 0 1200 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-16 w-full sm:h-20"
      fill="none"
    >
      <defs>
        <linearGradient id="wave-left" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brand-orange)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--brand-orange)", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id="wave-left-blue" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brand-blue)", stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: "var(--brand-blue)", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id="wave-right" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brand-orange)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--brand-orange)", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id="wave-right-blue" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brand-blue)", stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: "var(--brand-blue)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d="M0 22C90 4 180 6 260 30S380 62 420 58" stroke="url(#wave-left)" strokeWidth="1.5" />
      <path d="M0 34C100 26 190 22 270 44S360 66 400 66" stroke="url(#wave-left-blue)" strokeWidth="1.5" />
      <path d="M1200 30C1110 12 1010 22 920 46S790 66 740 58" stroke="url(#wave-right)" strokeWidth="1.5" />
      <path d="M1200 42C1100 40 1010 56 920 60S820 58 780 52" stroke="url(#wave-right-blue)" strokeWidth="1.5" />
    </svg>
  );
}
