/**
 * Local sample content for the app detail template page.
 * Each app gets the same Lorem ipsum structure for now; swap in real copy per app later.
 * Components render `body` blocks in order, so pages can be rearranged without code changes.
 */
import { APPS, type ShowcaseApp } from "./apps";

export type ScreenKind = "list" | "chart" | "table";

export interface GallerySlide {
  kind: ScreenKind;
  title: string;
}

export type DetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "video"; title: string }
  | { type: "gallery"; label: string; slides: GallerySlide[] }
  | { type: "heading"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "link"; label: string };

export interface AppDetail {
  app: ShowcaseApp;
  hero: { tagline: string; primaryCta: string; secondaryCta: string };
  banner: { text: string; ctaLabel: string };
  summary: { title: string; items: string[] };
  body: DetailBlock[];
}

const P1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et blanditiis officia expedita dignissimos in ex repellat eum modi dignissimos quo dolores. Corrupti imperdiet odio consequatur et laborum. Fuga consequatur aut animi adipisicing inure accusamus expedita consequatur est.";
const P2 =
  "In corrupti et facere dignissimos est quidem ex nulla elit. In excepturi incididunt in ullamco voluptas. Libero culpa qui repellendus.";
const P3 =
  "Autem est sed laboris nulla iusto dolorem sed. Tempor facere reprehenderit deserunt et non consequatur. Quo quod alias non tempore commodo sit anim cillum sint laborum molestias voluptatum.";
const P4 =
  "Voluptas sint soluta fugiat odio at. Esse mollitia deserunt sint autem ad possimus pariatur eum sint. In temporibus distinctio cillum autem ullam. Sit vero molestias mollitia ex in facilis dolores possimus et.";
const P5 =
  "Tempor lorem laborum irure enim ipsum eos exercitation cupiditate corrupti in veniam. Et tempore libero culpa distinctio in libero sit placeat quos dolor. Cumque ut quod provident duis sed quo magna deserunt laboris dolorum tempor.";
const P6 =
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.";
const P7 =
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.";

function buildDetail(app: ShowcaseApp): AppDetail {
  return {
    app,
    hero: {
      tagline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      primaryCta: "Lorem ipsum",
      secondaryCta: "Dolor sit",
    },
    banner: { text: "Lorem ipsum dolor sit amet", ctaLabel: "Lorem ipsum" },
    summary: {
      title: "Lorem ipsum",
      items: ["Lorem ipsum dolor sit amet.", "Consectetur adipiscing elit.", "Nam repellendus quasi."],
    },
    body: [
      { type: "paragraph", text: P1 },
      { type: "paragraph", text: P2 },
      { type: "video", title: app.name },
      { type: "paragraph", text: P3 },
      { type: "paragraph", text: P4 },
      {
        type: "gallery",
        label: `${app.name} screens`,
        slides: [
          { kind: "list", title: "Lorem ipsum" },
          { kind: "chart", title: "Dolor sit" },
          { kind: "table", title: "Amet elit" },
          { kind: "chart", title: "Consectetur" },
          { kind: "list", title: "Adipiscing" },
          { kind: "table", title: "Sed eiusmod" },
        ],
      },
      { type: "paragraph", text: P5 },
      { type: "heading", text: "Lorem ipsum" },
      {
        type: "bullets",
        items: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt ut labore.",
          "Ut enim ad minim veniam, quis nostrud exercitation.",
          "Duis aute irure dolor in reprehenderit in voluptate.",
        ],
      },
      { type: "paragraph", text: P6 },
      { type: "heading", text: "Dolor sit amet" },
      {
        type: "steps",
        items: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt ut labore et dolore.",
          "Ut enim ad minim veniam, quis nostrud exercitation.",
        ],
      },
      { type: "paragraph", text: P7 },
      { type: "link", label: "Lorem ipsum" },
    ],
  };
}

export function getAppDetail(appId: string): AppDetail | undefined {
  const app = APPS.find((a) => a.id === appId);
  return app ? buildDetail(app) : undefined;
}
