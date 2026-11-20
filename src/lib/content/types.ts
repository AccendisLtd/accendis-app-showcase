/**
 * Content model for the CMS. Drafts are stored as JSON documents in
 * `content_items.draft` (kind "app" or "homepage"); publishing copies a draft into
 * `published_content.data`. Every reader goes through the normalisers below, so
 * partial documents (e.g. drafts written by an agent) still render safely.
 */
import {
  CATEGORY_IDS,
  type AppPreview,
  type CategoryId,
  type MediaRef,
  type ShowcaseApp,
} from "@/data/apps";

export interface CtaLink {
  label: string;
  url: string;
}

export type ScreenKind = "list" | "chart" | "table";

export interface GallerySlide {
  title: string;
  kind: ScreenKind;
  image: MediaRef | null;
}

export type CalloutTone = "info" | "tip" | "warning";

export type DetailBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "list"; style: "bullets" | "steps"; items: string[] }
  | { id: string; type: "callout"; tone: CalloutTone; title: string; text: string }
  | { id: string; type: "video"; title: string; url: string; file: MediaRef | null }
  | { id: string; type: "presentation"; title: string; url: string; file: MediaRef | null }
  | { id: string; type: "gallery"; label: string; slides: GallerySlide[] }
  | { id: string; type: "link"; label: string; url: string };

export type BlockType = DetailBlock["type"];

export interface Transparency {
  platforms: string[];
  integrations: string[];
  costs: string;
  limitations: string[];
  diy: string;
}

export interface AppContent {
  name: string;
  category: CategoryId;
  description: string;
  ctaLabel: string;
  roles: string[];
  appUrl: string;
  cardImage: MediaRef | null;
  preview: AppPreview;
  hero: { tagline: string; image: MediaRef | null; primaryCta: CtaLink; secondaryCta: CtaLink };
  banner: { text: string; cta: CtaLink };
  summary: { title: string; items: string[] };
  transparency: Transparency;
  body: DetailBlock[];
}

export interface HomeContent {
  eyebrow: string;
  heading: string;
  intro: string;
  roleLabel: string;
  rolePlaceholder: string;
  exploreLabel: string;
  helperText: string;
  showcaseHeading: string;
  closing: { heading: string; text: string; cta: CtaLink };
}

export interface AppDetail {
  slug: string;
  content: AppContent;
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  list: "List",
  callout: "Callout",
  video: "Video",
  presentation: "Presentation",
  gallery: "Screenshot carousel",
  link: "Link",
};

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const cta = (v: unknown, label = ""): CtaLink => ({ label: str(obj(v).label, label), url: str(obj(v).url) });

export function media(v: unknown): MediaRef | null {
  const o = obj(v);
  return typeof o.path === "string" && o.path ? { path: o.path, alt: str(o.alt) } : null;
}

export function isCategory(v: unknown): v is CategoryId {
  return CATEGORY_IDS.includes(v as CategoryId);
}

let blockCounter = 0;
export function newBlockId() {
  blockCounter += 1;
  return `b${Date.now().toString(36)}${blockCounter}`;
}

export function newBlock(type: BlockType): DetailBlock {
  const id = newBlockId();
  switch (type) {
    case "paragraph":
      return { id, type, text: "" };
    case "heading":
      return { id, type, text: "" };
    case "list":
      return { id, type, style: "bullets", items: [] };
    case "callout":
      return { id, type, tone: "info", title: "", text: "" };
    case "video":
      return { id, type, title: "", url: "", file: null };
    case "presentation":
      return { id, type, title: "", url: "", file: null };
    case "gallery":
      return { id, type, label: "", slides: [] };
    case "link":
      return { id, type, label: "", url: "" };
  }
}

const SCREEN_KINDS: ScreenKind[] = ["list", "chart", "table"];
const TONES: CalloutTone[] = ["info", "tip", "warning"];

export function normalizeBlock(raw: unknown, index = 0): DetailBlock | null {
  const b = obj(raw);
  const id = str(b.id) || `block-${index}`;
  switch (b.type) {
    case "paragraph":
    case "heading":
      return { id, type: b.type, text: str(b.text) };
    case "list":
    case "bullets":
    case "steps": {
      const style = b.type === "steps" || b.style === "steps" ? "steps" : "bullets";
      return { id, type: "list", style, items: strs(b.items) };
    }
    case "callout":
      return {
        id,
        type: "callout",
        tone: TONES.includes(b.tone as CalloutTone) ? (b.tone as CalloutTone) : "info",
        title: str(b.title),
        text: str(b.text),
      };
    case "video":
    case "presentation":
      return { id, type: b.type, title: str(b.title), url: str(b.url), file: media(b.file) };
    case "gallery":
      return {
        id,
        type: "gallery",
        label: str(b.label),
        slides: (Array.isArray(b.slides) ? b.slides : []).map((s) => {
          const o = obj(s);
          return {
            title: str(o.title),
            kind: SCREEN_KINDS.includes(o.kind as ScreenKind) ? (o.kind as ScreenKind) : "list",
            image: media(o.image),
          };
        }),
      };
    case "link":
      return { id, type: "link", label: str(b.label), url: str(b.url) };
    default:
      return null;
  }
}

const DEFAULT_PREVIEW: AppPreview = { kind: "schedule", rows: [{ label: "" }] };

function normalizePreview(v: unknown): AppPreview {
  const p = obj(v);
  if (!Array.isArray(p.rows)) return DEFAULT_PREVIEW;
  const rows = p.rows.map(obj);
  switch (p.kind) {
    case "ledger":
      return { kind: "ledger", rows: rows.map((r) => ({ label: str(r.label), amount: Number(r.amount) || 0 })) };
    case "checklist":
      return { kind: "checklist", rows: rows.map((r) => ({ label: str(r.label), done: r.done === true })) };
    case "inbox":
      return { kind: "inbox", rows: rows.map((r) => ({ label: str(r.label) })) };
    default:
      return { kind: "schedule", rows: rows.map((r) => ({ label: str(r.label) })) };
  }
}

export function normalizeApp(raw: unknown): AppContent {
  const d = obj(raw);
  const hero = obj(d.hero);
  const banner = obj(d.banner);
  const summary = obj(d.summary);
  const t = obj(d.transparency);
  return {
    name: str(d.name, "Untitled app"),
    category: isCategory(d.category) ? d.category : "personal",
    description: str(d.description),
    ctaLabel: str(d.ctaLabel, "Find out more"),
    roles: strs(d.roles),
    appUrl: str(d.appUrl),
    cardImage: media(d.cardImage),
    preview: normalizePreview(d.preview),
    hero: {
      tagline: str(hero.tagline),
      image: media(hero.image),
      primaryCta: cta(hero.primaryCta),
      secondaryCta: cta(hero.secondaryCta),
    },
    banner: { text: str(banner.text), cta: cta(banner.cta) },
    summary: { title: str(summary.title), items: strs(summary.items) },
    transparency: {
      platforms: strs(t.platforms),
      integrations: strs(t.integrations),
      costs: str(t.costs),
      limitations: strs(t.limitations),
      diy: str(t.diy),
    },
    body: (Array.isArray(d.body) ? d.body : [])
      .map((b, i) => normalizeBlock(b, i))
      .filter((b): b is DetailBlock => b !== null),
  };
}

export function normalizeHome(raw: unknown): HomeContent {
  const d = obj(raw);
  const c = obj(d.closing);
  return {
    eyebrow: str(d.eyebrow),
    heading: str(d.heading),
    intro: str(d.intro),
    roleLabel: str(d.roleLabel),
    rolePlaceholder: str(d.rolePlaceholder, "Any role"),
    exploreLabel: str(d.exploreLabel, "Explore"),
    helperText: str(d.helperText),
    showcaseHeading: str(d.showcaseHeading),
    closing: { heading: str(c.heading), text: str(c.text), cta: cta(c.cta) },
  };
}

export function emptyApp(name = "New app"): AppContent {
  return normalizeApp({ name, ctaLabel: "Find out more" });
}

export function toShowcaseApp(slug: string, c: AppContent): ShowcaseApp {
  return {
    id: slug,
    name: c.name,
    category: c.category,
    description: c.description,
    ctaLabel: c.ctaLabel,
    roles: c.roles,
    preview: c.preview,
    appUrl: c.appUrl,
    cardImage: c.cardImage,
  };
}

/** Moves the item at `from` to `to`, returning a new array (out-of-range moves are ignored). */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length || from === to) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
}

/** Every media path a document references (mirrors public.content_media_paths in SQL). */
export function collectMediaPaths(value: unknown, out = new Set<string>()): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectMediaPaths(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "path" && typeof v === "string" && v) out.add(v);
      else collectMediaPaths(v, out);
    }
  }
  return [...out];
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Converts a YouTube/Vimeo page URL into an embeddable player URL; other https URLs pass through. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video${u.pathname}`;
    return u.toString();
  } catch {
    return null;
  }
}

/** True for links visitors may follow: relative paths, https, http and mailto. */
export function isSafeUrl(url: string) {
  if (!url) return false;
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  return /^(https?:|mailto:)/i.test(url);
}
