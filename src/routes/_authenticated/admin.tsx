import { useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink, LogOut } from "lucide-react";

import { AccendisLogo } from "@/components/brand/AccendisLogo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fetchIsAdmin } from "@/lib/admin/api";

export const Route = createFileRoute("/_authenticated/admin")({
  // Friendly gate only; the database refuses non-admin reads and writes regardless.
  beforeLoad: async () => ({ isAdmin: await fetchIsAdmin() }),
  head: () => ({
    meta: [
      { title: "Content admin — Accendis" },
      { name: "description", content: "Manage Accendis homepage text, apps and roles." },
      { property: "og:title", content: "Content admin — Accendis" },
      { property: "og:description", content: "Manage Accendis homepage text, apps and roles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Apps", exact: true },
  { to: "/admin/homepage", label: "Homepage", exact: false },
  { to: "/admin/roles", label: "Roles & categories", exact: false },
] as const;

function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  };
}

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const signOut = useSignOut();

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">You don't have editing access.</h1>
          <p className="mt-3 text-muted-foreground">
            You're signed in as {user.email}, but this account hasn't been made an administrator. Ask an existing administrator to add you.
          </p>
          <Button onClick={signOut} variant="outline" className="mt-6 h-11 rounded-lg">
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 sm:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <AccendisLogo />
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">Admin</span>
          </Link>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noreferrer">
                View site <ExternalLink />
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out <LogOut />
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <Outlet />
      </div>
    </div>
  );
}
