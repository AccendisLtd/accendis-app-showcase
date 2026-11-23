import type * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AccendisLogo } from "@/components/brand/AccendisLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

function safeRedirect(value: unknown) {
  if (typeof value !== "string") return "/admin";
  try {
    const u = new URL(value, "http://x");
    return u.pathname.startsWith("/admin") ? u.pathname + u.search : "/admin";
  } catch {
    return "/admin";
  }
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined }),
  head: () => ({
    meta: [
      { title: "Administrator sign in — Accendis" },
      { name: "description", content: "Sign in to manage Accendis content." },
      { property: "og:title", content: "Administrator sign in — Accendis" },
      { property: "og:description", content: "Sign in to manage Accendis content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError("That email and password didn't match an account.");
    navigate({ to: safeRedirect(search.redirect), replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <AccendisLogo />
        <h1 className="mt-10 font-display text-4xl leading-tight">Welcome back.</h1>
        <p className="mt-3 text-muted-foreground">Sign in to edit the Accendis website. Accounts are created by an administrator.</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
          </div>
          {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="h-12 rounded-lg text-base font-semibold">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
