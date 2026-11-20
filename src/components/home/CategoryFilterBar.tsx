import { categoryFilters, type Category, type CategoryFilter } from "@/data/apps";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "./category-styles";

interface CategoryFilterBarProps {
  categories: Category[];
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  counts?: Partial<Record<CategoryFilter, number>>;
}

export function CategoryFilterBar({ categories, value, onChange }: CategoryFilterBarProps) {
  return (
    <div role="radiogroup" aria-label="Category" className="flex flex-wrap gap-2.5 sm:gap-3">
      {categoryFilters(categories).map((filter) => {
        const active = filter.id === value;
        return (
          <button
            key={filter.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "inline-flex h-10 items-center gap-2.5 rounded-lg border px-5 text-[0.95rem] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-background text-foreground hover:border-input hover:bg-muted",
            )}
          >
            {filter.id !== "all" && (
              <span
                aria-hidden="true"
                className={cn(
                  "size-2.5 rounded-full",
                  CATEGORY_STYLES[filter.id].dot,
                  active && "ring-2 ring-primary-foreground/70",
                )}
              />
            )}
            {filter.name}
          </button>
        );
      })}
    </div>
  );
}
