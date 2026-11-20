import { createFileRoute } from "@tanstack/react-router";

/**
 * Stable public URL for published media: /media/<path>.
 * Uses the publishable key, so storage policies only allow files referenced by
 * published content; draft media returns 404. Redirects to a short-lived signed URL
 * (Supabase serves it with range support for video).
 */
export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent(params._splat ?? "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const { createPublicSupabase } = await import("@/lib/content/public-client.server");
        const { data, error } = await createPublicSupabase().storage.from("media").createSignedUrl(path, 3600);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(null, {
          status: 302,
          headers: { location: data.signedUrl, "cache-control": "public, max-age=600" },
        });
      },
    },
  },
});
