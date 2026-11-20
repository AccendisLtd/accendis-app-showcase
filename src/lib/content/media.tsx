import { createContext, useContext, type ReactNode } from "react";

import type { MediaRef } from "@/data/apps";

type Resolver = (path: string) => string | undefined;

/** Public pages resolve media through the /media proxy (published files only). */
export const publicMediaUrl: Resolver = (path) =>
  `/media/${path.split("/").map(encodeURIComponent).join("/")}`;

const MediaContext = createContext<Resolver>(publicMediaUrl);

/** Admin previews pass a resolver backed by signed URLs so drafts stay private. */
export function MediaProvider({ resolve, children }: { resolve: Resolver; children: ReactNode }) {
  return <MediaContext.Provider value={resolve}>{children}</MediaContext.Provider>;
}

export function useMediaUrl(ref: MediaRef | null | undefined): string | undefined {
  const resolve = useContext(MediaContext);
  return ref?.path ? resolve(ref.path) : undefined;
}
