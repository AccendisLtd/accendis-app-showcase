import { ArrowRight } from "lucide-react";

import ribbon from "@/assets/hero-ribbon-soft.jpg";
import { AccendisLogo } from "@/components/brand/AccendisLogo";
import { Button } from "@/components/ui/button";
import type { RoleId } from "@/data/apps";
import { RoleSelect } from "./RoleSelect";

interface HeroProps {
  role: RoleId | null;
  onRoleChange: (role: RoleId | null) => void;
  onExplore: () => void;
}

export function Hero({ role, onRoleChange, onExplore }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8 lg:px-10">
        <AccendisLogo />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 pb-16 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:px-10 lg:pb-28">
        <div className="relative z-10 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground sm:text-sm">
            Lorem ipsum dolor
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
            Lorem ipsum
            <br />
            dolor sit.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <form
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onExplore();
            }}
          >
            <label htmlFor="hero-role" className="text-lg font-bold sm:mr-3">
              Lorem
            </label>
            <RoleSelect id="hero-role" value={role} onChange={onRoleChange} />
            <Button type="submit" className="h-12 rounded-lg px-6 text-base font-semibold">
              Dolor sit
              <ArrowRight />
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="pointer-events-none relative mx-auto hidden w-full sm:block sm:max-w-md lg:max-w-none">
          <img
            src={ribbon}
            alt=""
            width={1536}
            height={768}
            fetchPriority="high"
            className="h-auto w-full select-none mix-blend-multiply lg:w-[115%] lg:max-w-none"
          />
        </div>
      </div>
    </header>
  );
}
