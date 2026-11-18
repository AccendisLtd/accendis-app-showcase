import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { DetailBlock } from "@/data/app-details";
import { ScreenGallery } from "./ScreenGallery";
import { VideoPreview } from "./VideoPreview";

/** Renders the long-form content blocks of an app page in order. */
export function DetailBody({ blocks }: { blocks: DetailBlock[] }) {
  return (
    <div className="flex flex-col gap-6 text-base leading-relaxed text-foreground/85 sm:text-[1.05rem]">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: DetailBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "video":
      return (
        <div className="my-4">
          <VideoPreview title={block.title} />
        </div>
      );
    case "gallery":
      return (
        <div className="my-4">
          <ScreenGallery label={block.label} slides={block.slides} />
        </div>
      );
    case "heading":
      return (
        <h2 className="-mb-2 mt-6 font-display text-2xl leading-tight text-heading-accent sm:text-[1.75rem]">
          {block.text}
        </h2>
      );
    case "bullets":
      return (
        <ul className="list-disc space-y-1.5 pl-6 marker:text-primary">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="list-decimal space-y-1.5 pl-6 marker:font-bold marker:text-primary">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      );
    case "link":
      return (
        <Link
          to="/"
          hash="apps"
          className="inline-flex w-fit items-center gap-1.5 rounded-sm text-[1.05rem] font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {block.label}
          <ArrowRight className="size-[18px]" strokeWidth={2.25} />
        </Link>
      );
  }
}
