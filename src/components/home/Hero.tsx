import { ArrowRight } from "lucide-react";

import ribbon from "@/assets/hero-ribbon-bands.jpg";
import { AccendisLogo } from "@/components/brand/AccendisLogo";
import { Button } from "@/components/ui/button";
import type { Role, RoleId } from "@/data/apps";
import type { HomeContent } from "@/lib/content/types";
import { RoleSelect } from "./RoleSelect";

interface HeroProps {
  content: HomeContent;
  roles: Role[];
  role: RoleId | null;
  onRoleChange: (role: RoleId | null) => void;
  onExplore: () => void;
}

export function Hero({ content, roles, role, onRoleChange, onExplore }: HeroProps) {
  const headingLines = content.heading.split("\n");
  return (
    <header className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8 lg:px-10">
        <AccendisLogo />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 pb-16 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:px-10 lg:pb-28">
        <div className="relative z-10 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground sm:text-sm">
            {content.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
            {headingLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            {content.intro}
          </p>

          <form
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onExplore();
            }}
          >
            <label htmlFor="hero-role" className="text-lg font-bold sm:mr-3">
              {content.roleLabel}
            </label>
            <RoleSelect
              id="hero-role"
              roles={roles}
              placeholder={content.rolePlaceholder}
              value={role}
              onChange={onRoleChange}
            />
            <Button type="submit" className="h-12 rounded-lg px-6 text-base font-semibold">
              {content.exploreLabel}
              <ArrowRight />
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            {content.helperText}
          </p>
        </div>

        <div className="pointer-events-none relative mx-auto mt-10 w-full max-w-xs sm:mt-8 sm:max-w-md lg:mt-0 lg:max-w-none">
          <img
            src={ribbon}
            alt=""
            width={1536}
            height={640}
            fetchPriority="high"
            className="h-auto w-full select-none mix-blend-multiply lg:ml-[4%] lg:w-[138%] lg:max-w-none"
          />
        </div>
      </div>
    </header>
  );
}
