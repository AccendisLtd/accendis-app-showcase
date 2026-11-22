import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Section } from "@/components/admin/fields";
import { CATEGORY_STYLES } from "@/components/home/category-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { categoriesQuery, deleteRole, renameCategory, rolesQuery, upsertRole } from "@/lib/admin/api";
import { slugify } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(rolesQuery), context.queryClient.ensureQueryData(categoriesQuery)]),
  component: RolesPage,
});

function RolesPage() {
  const { data: roles } = useSuspenseQuery(rolesQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");

  async function run(fn: () => Promise<void>, msg: string) {
    try {
      await fn();
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(msg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function swap(i: number, j: number) {
    const a = roles[i]!, b = roles[j]!;
    await run(async () => {
      await upsertRole({ ...a, sort_order: b.sort_order === a.sort_order ? j : b.sort_order });
      await upsertRole({ ...b, sort_order: b.sort_order === a.sort_order ? i : a.sort_order });
    }, "Order updated");
  }

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl">Roles & categories</h1>
      <Section title="Discovery roles" hint="Shown in the homepage dropdown. Changes go live straight away. Pick which apps suit each role on the app's page.">
        <ul className="grid gap-2">
          {roles.map((r, i) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
              <Input
                defaultValue={r.name}
                aria-label="Role name"
                className="h-10 max-w-xs"
                onBlur={(e) => e.target.value.trim() && e.target.value !== r.name && run(() => upsertRole({ ...r, name: e.target.value.trim() }), "Role renamed")}
              />
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={r.is_active} onCheckedChange={(v) => run(() => upsertRole({ ...r, is_active: v }), v ? "Role shown" : "Role hidden")} />
                Visible
              </label>
              <div className="ml-auto flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => swap(i, i - 1)}><ArrowUp /></Button>
                <Button size="icon" variant="ghost" aria-label="Move down" disabled={i === roles.length - 1} onClick={() => swap(i, i + 1)}><ArrowDown /></Button>
                <Button size="icon" variant="ghost" aria-label="Delete role" onClick={() => confirm(`Delete "${r.name}"?`) && run(() => deleteRole(r.id), "Role deleted")}><Trash2 /></Button>
              </div>
            </li>
          ))}
        </ul>
        <form
          className="flex gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const id = slugify(newName);
            if (!id) return;
            run(() => upsertRole({ id, name: newName.trim(), sort_order: roles.length, is_active: true }), "Role added").then(() => setNewName(""));
          }}
        >
          <Input placeholder="New role" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-10 max-w-xs" aria-label="New role name" />
          <Button type="submit" variant="outline"><Plus /> Add role</Button>
        </form>
      </Section>

      <Section title="Categories" hint="Rename the filters. Colours stay fixed: Personal orange, Home mint, Work lavender, Business blue.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c.id} className={cn("flex items-center gap-3 rounded-xl border p-3", CATEGORY_STYLES[c.id].surface)}>
              <span className={cn("size-3 rounded-full", CATEGORY_STYLES[c.id].dot)} />
              <Input
                defaultValue={c.name}
                aria-label={`Name for ${c.id}`}
                className="h-10 bg-background"
                onBlur={(e) => e.target.value.trim() && e.target.value !== c.name && run(() => renameCategory(c.id, e.target.value.trim()), "Category renamed")}
              />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
