import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MediaRef } from "@/data/apps";
import { signMedia, uploadMedia } from "@/lib/admin/api";
import type { CtaLink } from "@/lib/content/types";

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

export function TextField({ label, value, onChange, multiline, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string; placeholder?: string }) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-11" />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** One item per line. */
export function LinesField({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  const [text, setText] = useState(value.join("\n"));
  useEffect(() => {
    if (text.split("\n").map((s) => s.trim()).filter(Boolean).join("\n") !== value.join("\n")) setText(value.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <TextField
      label={label}
      multiline
      value={text}
      hint={hint ?? "One per line."}
      onChange={(t) => {
        setText(t);
        onChange(t.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
    />
  );
}

export function CtaFields({ label, value, onChange }: { label: string; value: CtaLink; onChange: (v: CtaLink) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label={`${label} text`} value={value.label} onChange={(l) => onChange({ ...value, label: l })} />
      <TextField label={`${label} link`} value={value.url} placeholder="https://… or /apps/…" onChange={(u) => onChange({ ...value, url: u })} />
    </div>
  );
}

export function useSignedUrl(path: string | undefined) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let live = true;
    if (!path) {
      setUrl(undefined);
      return;
    }
    signMedia([path]).then((m) => live && setUrl(m[path])).catch(() => live && setUrl(undefined));
    return () => {
      live = false;
    };
  }, [path]);
  return url;
}

export function MediaField({ label, value, onChange, folder, accept = "image/*", kind = "image" }: { label: string; value: MediaRef | null; onChange: (v: MediaRef | null) => void; folder: string; accept?: string; kind?: "image" | "video" | "file" }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const url = useSignedUrl(value?.path);
  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadMedia(file, folder);
      onChange({ path, alt: value?.alt ?? "" });
      toast.success("Uploaded. It stays private until you publish.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap items-start gap-4 rounded-xl border border-dashed border-input p-4">
        {value && url && kind === "image" && <img src={url} alt="" className="h-24 w-32 rounded-lg object-cover" />}
        {value && url && kind === "video" && <video src={url} className="h-24 w-40 rounded-lg bg-scrim" muted />}
        {value && kind === "file" && <span className="text-sm">{value.path.split("/").pop()}</span>}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" disabled={busy}>
              <label htmlFor={id} className="cursor-pointer">
                {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} {value ? "Replace" : "Upload"}
              </label>
            </Button>
            <input
              id={id}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => {
                pick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {value && (
              <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
                <Trash2 /> Remove
              </Button>
            )}
          </div>
          {value && kind !== "file" && (
            <Input placeholder="Describe it for screen readers" value={value.alt ?? ""} onChange={(e) => onChange({ ...value, alt: e.target.value })} className="h-9" />
          )}
        </div>
      </div>
    </div>
  );
}
