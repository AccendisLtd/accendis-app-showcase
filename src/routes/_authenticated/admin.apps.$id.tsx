import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { BlockEditor } from "@/components/admin/BlockEditor";
import { CtaFields, LinesField, MediaField, Section, TextField } from "@/components/admin/fields";
import { StatusBar } from "@/components/admin/StatusBar";
import { Label } from "@/components/ui/label";
import { categoriesQuery, itemQuery, rolesQuery, saveDraft } from "@/lib/admin/api";
import { normalizeApp, slugify, type AppContent } from "@/lib/content/types";

export const Route = createFileRoute("/_authenticated/admin/apps/$id")({
  loader: async ({ context, params }) => {
    const [row] = await Promise.all([
      context.queryClient.ensureQueryData(itemQuery(params.id)),
      context.queryClient.ensureQueryData(rolesQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
    ]);
    if (!row || row.kind !== "app") throw notFound();
  },
  component: AppEditor,
  notFoundComponent: () => <p>That app doesn't exist.</p>,
});

function AppEditor() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: row } = useSuspenseQuery(itemQuery(id));
  const { data: roles } = useSuspenseQuery(rolesQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const [draft, setDraft] = useState<AppContent>(() => normalizeApp(row?.draft));
  const [slug, setSlug] = useState(row?.slug ?? "");
  const [sortOrder, setSortOrder] = useState(row?.sort_order ?? 0);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!row) return null;
  const folder = `apps/${row.id}`;
  const set = <K extends keyof AppContent>(key: K, value: AppContent[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });

  async function save() {
    await saveDraft(id, { draft, slug: slugify(slug) || row!.slug, sort_order: sortOrder });
    setDirty(false);
    await refresh();
  }

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All apps
      </Link>
      <h1 className="mb-6 mt-3 font-display text-4xl">{draft.name || "Untitled app"}</h1>
      <StatusBar row={row} dirty={dirty} onSave={save} onChanged={refresh} />

      <div className="grid gap-6">
        <Section title="Card" hint="What visitors see on the homepage.">
          <TextField label="App name" value={draft.name} onChange={(v) => set("name", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Page address" value={slug} onChange={(v) => { setSlug(v); setDirty(true); }} hint={`accendis…/apps/${slugify(slug) || "…"}`} />
            <TextField label="Order on homepage" value={String(sortOrder)} onChange={(v) => { setSortOrder(Number(v.replace(/\D/g, "")) || 0); setDirty(true); }} hint="Lower numbers come first." />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-pressed={draft.category === c.id}
                  onClick={() => set("category", c.id)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <TextField label="Description" multiline value={draft.description} onChange={(v) => set("description", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Card link text" value={draft.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
            <TextField label="App website (optional)" value={draft.appUrl} placeholder="https://…" onChange={(v) => set("appUrl", v)} />
          </div>
          <MediaField label="Card image (optional — replaces the mini illustration)" folder={folder} value={draft.cardImage} onChange={(v) => set("cardImage", v)} />
          <div className="grid gap-2">
            <Label>Recommended for these roles</Label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => {
                const on = draft.roles.includes(r.id);
                return (
                  <button
                    type="button"
                    key={r.id}
                    aria-pressed={on}
                    onClick={() => set("roles", on ? draft.roles.filter((x) => x !== r.id) : [...draft.roles, r.id])}
                    className="rounded-full border border-border px-3 py-1 text-sm font-medium aria-pressed:border-primary aria-pressed:bg-accent"
                  >
                    {r.name}
                    {!r.is_active && " (hidden)"}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Story header" hint="The photo banner at the top of the app page. The strip beneath it uses the category colour.">
          <TextField label="Tagline" value={draft.hero.tagline} onChange={(v) => set("hero", { ...draft.hero, tagline: v })} />
          <MediaField label="Header photo" folder={folder} value={draft.hero.image} onChange={(v) => set("hero", { ...draft.hero, image: v })} />
          <CtaFields label="Main button" value={draft.hero.primaryCta} onChange={(v) => set("hero", { ...draft.hero, primaryCta: v })} />
          <CtaFields label="Second button" value={draft.hero.secondaryCta} onChange={(v) => set("hero", { ...draft.hero, secondaryCta: v })} />
          <TextField label="Strip text" value={draft.banner.text} onChange={(v) => set("banner", { ...draft.banner, text: v })} />
          <CtaFields label="Strip button" value={draft.banner.cta} onChange={(v) => set("banner", { ...draft.banner, cta: v })} />
        </Section>

        <Section title="At a glance" hint="The tinted box beside the story.">
          <TextField label="Title" value={draft.summary.title} onChange={(v) => set("summary", { ...draft.summary, title: v })} />
          <LinesField label="Key points" value={draft.summary.items} onChange={(v) => set("summary", { ...draft.summary, items: v })} />
        </Section>

        <Section title="Story" hint="Add, edit and reorder the blocks that make up the page.">
          <BlockEditor blocks={draft.body} onChange={(v) => set("body", v)} folder={folder} />
        </Section>

        <Section title="The honest details" hint="Be upfront about what it runs on, what it costs and where it falls short.">
          <LinesField label="Platforms" value={draft.transparency.platforms} onChange={(v) => set("transparency", { ...draft.transparency, platforms: v })} />
          <LinesField label="Integrations" value={draft.transparency.integrations} onChange={(v) => set("transparency", { ...draft.transparency, integrations: v })} />
          <TextField label="Costs" multiline value={draft.transparency.costs} onChange={(v) => set("transparency", { ...draft.transparency, costs: v })} />
          <LinesField label="Limitations" value={draft.transparency.limitations} onChange={(v) => set("transparency", { ...draft.transparency, limitations: v })} />
          <TextField label="Do it yourself" multiline value={draft.transparency.diy} onChange={(v) => set("transparency", { ...draft.transparency, diy: v })} />
        </Section>
      </div>
    </div>
  );
}
