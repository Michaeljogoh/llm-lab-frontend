"use client";

import { cn } from "@/lib/utils";

export type ExperimentFilter = "all" | "favorites";

interface ExperimentFiltersProps {
  value: ExperimentFilter;
  onChange: (value: ExperimentFilter) => void;
  totalCount: number;
  favoriteCount: number;
}

export function ExperimentFilters({
  value,
  onChange,
  totalCount,
  favoriteCount,
}: ExperimentFiltersProps) {
  const filters: { id: ExperimentFilter; label: string; count: number }[] = [
    { id: "all", label: "All experiments", count: totalCount },
    { id: "favorites", label: "Starred", count: favoriteCount },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          className={cn(
            "hover-black rounded-full border px-4 py-2 text-sm font-medium active:scale-[0.98]",
            value === filter.id
              ? "border-foreground bg-foreground text-background shadow-sm"
              : "border-border bg-card text-foreground"
          )}
        >
          {filter.label}
          <span className="ml-2 opacity-70">{filter.count}</span>
        </button>
      ))}
    </div>
  );
}
