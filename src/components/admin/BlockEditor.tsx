import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { BLOCK_LABELS, moveItem, newBlock, type BlockType, type DetailBlock, type GallerySlide } from "@/lib/content/types";
import { LinesField, MediaField, TextField } from "./fields";

const TYPES = Object.keys(BLOCK_LABELS) as BlockType[];

function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="h-11 rounded-md border border-input bg-background px-3 text-sm">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AddBlock({ onAdd, label = "Add block" }: { onAdd: (t: BlockType) => void; label?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus /> {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {TYPES.map((t) => (
          <DropdownMenuItem key={t} onSelect={() => onAdd(t)}>
            {BLOCK_LABELS[t]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BlockEditor({ blocks, onChange, folder }: { blocks: DetailBlock[]; onChange: (b: DetailBlock[]) => void; folder: string }) {
  const update = (i: number, b: DetailBlock) => onChange(blocks.map((x, j) => (j === i ? b : x)));
  const insert = (i: number, t: BlockType) => onChange([...blocks.slice(0, i), newBlock(t), ...blocks.slice(i)]);
  return (
    <div className="grid gap-4">
      {blocks.length === 0 && <p className="text-sm text-muted-foreground">No content yet. Add your first block.</p>}
      {blocks.map((block, i) => (
        <div key={block.id} className="rounded-xl border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {i + 1}. {BLOCK_LABELS[block.type]}
            </span>
            <div className="ml-auto flex gap-1">
              <Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => onChange(moveItem(blocks, i, i - 1))}>
                <ArrowUp />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Move down" disabled={i === blocks.length - 1} onClick={() => onChange(moveItem(blocks, i, i + 1))}>
                <ArrowDown />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Delete block" onClick={() => onChange(blocks.filter((_, j) => j !== i))}>
                <Trash2 />
              </Button>
            </div>
          </div>
          <BlockFields block={block} onChange={(b) => update(i, b)} folder={folder} />
        </div>
      ))}
      <div>
        <AddBlock onAdd={(t) => insert(blocks.length, t)} />
      </div>
    </div>
  );
}

function BlockFields({ block, onChange, folder }: { block: DetailBlock; onChange: (b: DetailBlock) => void; folder: string }) {
  switch (block.type) {
    case "paragraph":
      return <TextField label="Text" multiline value={block.text} onChange={(text) => onChange({ ...block, text })} hint="Use **bold**, _italic_ and [link text](https://…)." />;
    case "heading":
      return <TextField label="Heading" value={block.text} onChange={(text) => onChange({ ...block, text })} />;
    case "list":
      return (
        <div className="grid gap-4">
          <Select label="Style" value={block.style} options={[{ value: "bullets", label: "Bullet points" }, { value: "steps", label: "Numbered steps" }]} onChange={(style) => onChange({ ...block, style })} />
          <LinesField label="Items" value={block.items} onChange={(items) => onChange({ ...block, items })} />
        </div>
      );
    case "callout":
      return (
        <div className="grid gap-4">
          <Select label="Tone" value={block.tone} options={[{ value: "info", label: "Info (blue)" }, { value: "tip", label: "Tip (mint)" }, { value: "warning", label: "Heads up (orange)" }]} onChange={(tone) => onChange({ ...block, tone })} />
          <TextField label="Title" value={block.title} onChange={(title) => onChange({ ...block, title })} />
          <TextField label="Text" multiline value={block.text} onChange={(text) => onChange({ ...block, text })} />
        </div>
      );
    case "video":
    case "presentation": {
      const isVideo = block.type === "video";
      return (
        <div className="grid gap-4">
          <TextField label="Title" value={block.title} onChange={(title) => onChange({ ...block, title })} />
          <TextField
            label={isVideo ? "YouTube or Vimeo link" : "Embed link (Google Slides, Canva, PDF…)"}
            value={block.url}
            placeholder="https://…"
            onChange={(url) => onChange({ ...block, url })}
            hint="Or upload a file below. A link takes priority."
          />
          <MediaField
            label={isVideo ? "Video file" : "Presentation file (PDF)"}
            kind={isVideo ? "video" : "file"}
            accept={isVideo ? "video/*" : "application/pdf"}
            folder={folder}
            value={block.file}
            onChange={(file) => onChange({ ...block, file })}
          />
        </div>
      );
    }
    case "gallery":
      return (
        <div className="grid gap-4">
          <TextField label="Carousel name (for screen readers)" value={block.label} onChange={(label) => onChange({ ...block, label })} />
          {block.slides.map((s, i) => {
            const set = (slide: GallerySlide) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? slide : x)) });
            return (
              <div key={i} className="grid gap-3 rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Screen {i + 1}</span>
                  <div className="ml-auto flex gap-1">
                    <Button size="icon" variant="ghost" aria-label="Move screen up" disabled={i === 0} onClick={() => onChange({ ...block, slides: moveItem(block.slides, i, i - 1) })}>
                      <ArrowUp />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Move screen down" disabled={i === block.slides.length - 1} onClick={() => onChange({ ...block, slides: moveItem(block.slides, i, i + 1) })}>
                      <ArrowDown />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Remove screen" onClick={() => onChange({ ...block, slides: block.slides.filter((_, j) => j !== i) })}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <TextField label="Caption" value={s.title} onChange={(title) => set({ ...s, title })} />
                <MediaField label="Screenshot" folder={folder} value={s.image} onChange={(image) => set({ ...s, image })} />
              </div>
            );
          })}
          <div>
            <Button size="sm" variant="outline" onClick={() => onChange({ ...block, slides: [...block.slides, { title: "", kind: "list", image: null }] })}>
              <Plus /> Add screen
            </Button>
          </div>
        </div>
      );
    case "link":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Link text" value={block.label} onChange={(label) => onChange({ ...block, label })} />
          <TextField label="Link" value={block.url} placeholder="https://… (blank = back to all apps)" onChange={(url) => onChange({ ...block, url })} />
        </div>
      );
  }
}
