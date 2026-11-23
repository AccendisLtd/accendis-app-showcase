import type * as React from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/admin/StatusBar";
import { CATEGORY_STYLES } from "@/components/home/category-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItem, itemsQuery } from "@/lib/admin/api";
import { emptyApp, normalizeApp, slugify } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(itemsQuery("app")),
  component: AppsList,
});

function AppsList() {
  const { data: rows } = useSuspenseQuery(itemsQuery("app"));
  const [name, setName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const visible = rows.filter((r) => showArchived || r.status !== "archived");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(name);
    if (!slug) {
      toast.error("Give the app a name first");
      return;
    }
    try {
      const { id } = await createItem("app", slug, emptyApp(name.trim()), rows.length);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      navigate({ to: "/admin/apps/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof Error && err.message.includes("duplicate") ? "An app with that name already exists" : String(err));
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Apps</h1>
      <p className="mt-2 text-muted-foreground">Cards on the homepage and their story pages. Drafts stay private until you publish.</p>

      <form onSubmit={create} className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row">
        <Input placeholder="New app name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" aria-label="New app name" />
        <Button type="submit" className="h-11 rounded-lg">
          <Plus /> Add app
        </Button>
      </form>

      <ul className="mt-8 grid gap-3">
        {visible.map((row) => {
          const app = normalizeApp(row.draft);
          return (
            <li key={row.id}>
              <Link
                to="/admin/apps/$id"
                params={{ id: row.id }}
                className={cn("flex flex-wrap items-center gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-soft", CATEGORY_STYLES[app.category].surface)}
              >
                <span className={cn("size-3 rounded-full", CATEGORY_STYLES[app.category].dot)} />
                <span className="font-display text-xl">{app.name}</span>
                <span className="text-sm text-muted-foreground">/apps/{row.slug}</span>
                <span className="ml-auto">
                  <StatusBadge row={row} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {rows.some((r) => r.status === "archived") && (
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShowArchived((v) => !v)}>
          {showArchived ? "Hide archived" : "Show archived"}
        </Button>
      )}
    </div>
  );
}
