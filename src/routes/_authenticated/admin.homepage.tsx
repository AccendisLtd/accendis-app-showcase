import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { CtaFields, Section, TextField } from "@/components/admin/fields";
import { StatusBar } from "@/components/admin/StatusBar";
import { homeItemQuery, saveDraft } from "@/lib/admin/api";
import { normalizeHome, type HomeContent } from "@/lib/content/types";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeItemQuery),
  component: HomepageEditor,
});

function HomepageEditor() {
  const { data: row } = useSuspenseQuery(homeItemQuery);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<HomeContent>(() => normalizeHome(row?.draft));
  const [dirty, setDirty] = useState(false);
  if (!row) return <p>The homepage content is missing. Re-run the content setup.</p>;
  const set = (patch: Partial<HomeContent>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Homepage</h1>
      <StatusBar
        row={row}
        dirty={dirty}
        onChanged={refresh}
        onSave={async () => {
          await saveDraft(row.id, { draft });
          setDirty(false);
          await refresh();
        }}
      />
      <div className="grid gap-6">
        <Section title="Top of the page">
          <TextField label="Small heading" value={draft.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
          <TextField label="Headline" multiline value={draft.heading} onChange={(heading) => set({ heading })} hint="Each new line starts a new line on the page." />
          <TextField label="Intro" multiline value={draft.intro} onChange={(intro) => set({ intro })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Role dropdown label" value={draft.roleLabel} onChange={(roleLabel) => set({ roleLabel })} />
            <TextField label="Role dropdown placeholder" value={draft.rolePlaceholder} onChange={(rolePlaceholder) => set({ rolePlaceholder })} />
          </div>
          <TextField label="Button text" value={draft.exploreLabel} onChange={(exploreLabel) => set({ exploreLabel })} />
          <TextField label="Note under the button" value={draft.helperText} onChange={(helperText) => set({ helperText })} />
        </Section>
        <Section title="App showcase">
          <TextField label="Section heading" value={draft.showcaseHeading} onChange={(showcaseHeading) => set({ showcaseHeading })} />
        </Section>
        <Section title="Closing call to action" hint="Leave the link blank to scroll visitors back to the apps.">
          <TextField label="Heading" value={draft.closing.heading} onChange={(heading) => set({ closing: { ...draft.closing, heading } })} />
          <TextField label="Text" multiline value={draft.closing.text} onChange={(text) => set({ closing: { ...draft.closing, text } })} />
          <CtaFields label="Button" value={draft.closing.cta} onChange={(cta) => set({ closing: { ...draft.closing, cta } })} />
        </Section>
      </div>
    </div>
  );
}
