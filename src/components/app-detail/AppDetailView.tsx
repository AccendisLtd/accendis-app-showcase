import type { Category, Role } from "@/data/apps";
import type { AppContent } from "@/lib/content/types";
import { AppDetailHero } from "./AppDetailHero";
import { AppSummaryCard } from "./AppSummaryCard";
import { DetailBody } from "./DetailBody";
import { TransparencyPanel } from "./TransparencyPanel";

/** The app story template; shared by the public page and the private admin preview. */
export function AppDetailView({ content, roles, categories }: { content: AppContent; roles: Role[]; categories: Category[] }) {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        <AppDetailHero content={content} categories={categories} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:px-10 lg:pt-20">
        <aside className="md:order-last md:sticky md:top-8 md:self-start">
          <AppSummaryCard content={content} roles={roles} />
        </aside>
        <article className="min-w-0 max-w-2xl">
          <DetailBody blocks={content.body} />
          <TransparencyPanel data={content.transparency} />
        </article>
      </div>
    </>
  );
}
