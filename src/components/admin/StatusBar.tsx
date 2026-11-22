import { Archive, Eye, Loader2, RotateCcw, Save, Send, Undo2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { publishItem, unpublishItem, type ContentRow } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

export function StatusBadge({ row }: { row: Pick<ContentRow, "status" | "has_unpublished_changes"> }) {
  const label =
    row.status === "published"
      ? row.has_unpublished_changes
        ? "Published · draft has changes"
        : "Published"
      : row.status === "archived"
        ? "Archived"
        : "Draft";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        row.status === "published" ? "bg-home-soft text-foreground" : row.status === "archived" ? "bg-muted text-muted-foreground" : "bg-personal-soft text-foreground",
      )}
    >
      {label}
    </span>
  );
}

/** Save / preview / publish controls. `onSave` persists the draft. */
export function StatusBar({ row, dirty, onSave, onChanged }: { row: ContentRow; dirty: boolean; onSave: () => Promise<void>; onChanged: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  async function run(name: string, fn: () => Promise<void>, msg: string) {
    setBusy(name);
    try {
      await fn();
      toast.success(msg);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }
  const spin = (n: string, icon: ReactNode) => (busy === n ? <Loader2 className="animate-spin" /> : icon);
  return (
    <div className="sticky top-0 z-20 mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-soft backdrop-blur">
      <StatusBadge row={{ ...row, has_unpublished_changes: row.has_unpublished_changes || dirty }} />
      {dirty && <span className="text-xs text-muted-foreground">Unsaved edits</span>}
      <div className="ml-auto flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={!!busy || !dirty} onClick={() => run("save", onSave, "Draft saved")}>
          {spin("save", <Save />)} Save draft
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!!busy}
          onClick={() =>
            run("preview", async () => {
              if (dirty) await onSave();
              window.open(`/admin/preview/${row.id}`, "_blank");
            }, "Preview opened in a new tab")
          }
        >
          {spin("preview", <Eye />)} Preview
        </Button>
        {row.status !== "archived" && (
          <Button
            size="sm"
            disabled={!!busy}
            onClick={() =>
              run("publish", async () => {
                if (dirty) await onSave();
                await publishItem(row.id);
              }, "Published — it's live now")
            }
          >
            {spin("publish", <Send />)} Publish
          </Button>
        )}
        {row.status === "published" && (
          <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => run("unpublish", () => unpublishItem(row.id), "Unpublished — visitors can no longer see it")}>
            {spin("unpublish", <Undo2 />)} Unpublish
          </Button>
        )}
        {row.kind === "app" && row.status !== "archived" && (
          <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => run("archive", () => unpublishItem(row.id, true), "Archived")}>
            {spin("archive", <Archive />)} Archive
          </Button>
        )}
        {row.status === "archived" && (
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run("restore", () => unpublishItem(row.id, false), "Restored as a draft")}>
            {spin("restore", <RotateCcw />)} Restore as draft
          </Button>
        )}
      </div>
    </div>
  );
}
