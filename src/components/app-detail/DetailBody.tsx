import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Info, Lightbulb, Presentation } from "lucide-react";

import type { MediaRef } from "@/data/apps";
import { useMediaUrl } from "@/lib/content/media";
import { isSafeUrl, toEmbedUrl, type DetailBlock } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { RichText } from "./RichText";
import { ScreenGallery } from "./ScreenGallery";
import { VideoPreview } from "./VideoPreview";

/** Renders the long-form content blocks of an app page in order. */
export function DetailBody({ blocks }: { blocks: DetailBlock[] }) {
  return (
    <div className="flex flex-col gap-6 text-base leading-relaxed text-foreground/85 sm:text-[1.05rem]">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}

const CALLOUT = {
  info: { icon: Info, cls: "border-business-edge bg-business-soft" },
  tip: { icon: Lightbulb, cls: "border-home-edge bg-home-soft" },
  warning: { icon: AlertTriangle, cls: "border-personal-edge bg-personal-soft" },
} as const;

function MediaFrame({ title, url, file, kind }: { title: string; url: string; file: MediaRef | null; kind: "video" | "presentation" }) {
  const fileUrl = useMediaUrl(file);
  const embed = url ? toEmbedUrl(url) : null;
  if (kind === "video" && fileUrl) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-business-edge bg-scrim">
        <video src={fileUrl} controls preload="metadata" className="aspect-video w-full" aria-label={title} />
      </figure>
    );
  }
  const src = embed ?? fileUrl;
  if (src) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-business-edge bg-card">
        <iframe
          src={src}
          title={title || kind}
          className={cn("w-full", kind === "video" ? "aspect-video" : "aspect-[4/3]")}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
        {kind === "presentation" && title && (
          <figcaption className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm font-semibold text-heading-accent">
            <Presentation className="size-4" /> {title}
          </figcaption>
        )}
      </figure>
    );
  }
  return kind === "video" ? <VideoPreview title={title} /> : null;
}

function Block({ block }: { block: DetailBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "video":
    case "presentation":
      return (
        <div className="my-4">
          <MediaFrame title={block.title} url={block.url} file={block.file} kind={block.type} />
        </div>
      );
    case "gallery":
      return block.slides.length ? (
        <div className="my-4">
          <ScreenGallery label={block.label || "Screenshots"} slides={block.slides} />
        </div>
      ) : null;
    case "heading":
      return (
        <h2 className="-mb-2 mt-6 font-display text-2xl leading-tight text-heading-accent sm:text-[1.75rem]">
          {block.text}
        </h2>
      );
    case "list": {
      const Tag = block.style === "steps" ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "space-y-1.5 pl-6 marker:text-primary",
            block.style === "steps" ? "list-decimal marker:font-bold" : "list-disc",
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <RichText text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "callout": {
      const { icon: Icon, cls } = CALLOUT[block.tone];
      return (
        <aside className={cn("my-2 flex gap-4 rounded-2xl border p-5 sm:p-6", cls)}>
          <Icon className="mt-0.5 size-5 shrink-0 text-heading-accent" />
          <div>
            {block.title && <p className="font-bold text-foreground">{block.title}</p>}
            {block.text && (
              <p className="mt-1">
                <RichText text={block.text} />
              </p>
            )}
          </div>
        </aside>
      );
    }
    case "link": {
      const cls =
        "inline-flex w-fit items-center gap-1.5 rounded-sm text-[1.05rem] font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
      const inner = (
        <>
          {block.label}
          <ArrowRight className="size-[18px]" strokeWidth={2.25} />
        </>
      );
      if (isSafeUrl(block.url)) {
        const external = /^https?:/i.test(block.url);
        return (
          <a href={block.url} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {inner}
          </a>
        );
      }
      return (
        <Link to="/" hash="apps" className={cls}>
          {inner}
        </Link>
      );
    }
  }
}
