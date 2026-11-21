import type { ReactNode } from "react";

import { isSafeUrl } from "@/lib/content/types";

/**
 * Minimal, safe inline formatting for paragraphs: **bold**, _italic_ and [text](url).
 * Renders React nodes only (never raw HTML), so stored text cannot inject markup.
 */
export function RichText({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}

const TOKEN = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)\s]+\))/g;

export function renderInline(text: string): ReactNode[] {
  const lines = text.split("\n");
  return lines.flatMap((line, li) => {
    const parts = line.split(TOKEN).filter(Boolean).map((part, i) => {
      const key = `${li}-${i}`;
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("_") && part.endsWith("_") && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (link) {
        const [, label, url] = link;
        if (!url || !isSafeUrl(url)) return <span key={key}>{label}</span>;
        const external = /^https?:/i.test(url);
        return (
          <a key={key} href={url} className="font-semibold text-primary underline underline-offset-4" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        );
      }
      return <span key={key}>{part}</span>;
    });
    return li < lines.length - 1 ? [...parts, <br key={`br-${li}`} />] : parts;
  });
}
