"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, FlaskConical, Plus, Sparkles } from "lucide-react";
import { Experiment } from "@/types/experiment";
import {
  exportAllExperimentsCsv,
  filterExperiments,
  getExperimentStats,
  sortExperiments,
} from "@/lib/experiment-utils";
import { useFavorites } from "@/hooks/use-favorites";
import {
  useExperiments,
  useInvalidateExperiments,
} from "@/hooks/use-experiments";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  ExperimentFilters,
  type ExperimentFilter,
} from "@/components/dashboard/ExperimentFilters";
import { NewExperimentSheet } from "@/components/dashboard/NewExperimentSheet";
import { ExperimentDetailSheet } from "@/components/dashboard/ExperimentDetailSheet";
import { ExperimentDetailCard } from "./ExperimentDetailCard";
import { BenchmarkPanel } from "./BenchmarkPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ExperimentsPage() {
  const { data: experiments = [], isLoading } = useExperiments();
  const invalidateExperiments = useInvalidateExperiments();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score" | "variations">("date");
  const [filter, setFilter] = useState<ExperimentFilter>("all");
  const [newSheetOpen, setNewSheetOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedExperiment) return;
    const fresh = experiments.find((e) => e._id === selectedExperiment._id);
    if (fresh) setSelectedExperiment(fresh);
  }, [experiments, selectedExperiment]);

  const totalRuns = experiments.reduce(
    (sum, experiment) => sum + experiment.responses.length,
    0
  );

  const favoriteCount = experiments.filter((e) =>
    favorites.has(e._id)
  ).length;

  const bestOverall = experiments.reduce((max, e) => {
    const { maxScore } = getExperimentStats(e);
    return Math.max(max, maxScore);
  }, 0);

  const filtered = useMemo(() => {
    let list = filterExperiments(experiments, search);
    if (filter === "favorites") {
      list = list.filter((experiment) => favorites.has(experiment._id));
    }
    return sortExperiments(list, sortBy);
  }, [experiments, search, sortBy, filter, favorites]);

  const handleDelete = async (id: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!BASE_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${BASE_URL}/experiment/${id}`);
      toast.success("Experiment deleted");
      if (selectedExperiment?._id === id) {
        setDetailOpen(false);
        setSelectedExperiment(null);
      }
      invalidateExperiments();
    } catch {
      toast.error("Failed to delete experiment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportAll = () => {
    const ok = exportAllExperimentsCsv(experiments);
    if (!ok) toast.error("No experiments to export");
    else toast.success("Export started");
  };

  const openExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <AppHeader
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onNewExperiment={() => setNewSheetOpen(true)}
        onExportAll={handleExportAll}
      />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <section className="overflow-hidden rounded-[22px] bg-deep-green px-5 py-7 text-white sm:px-8 sm:py-9">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back to dashboard
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono-label text-white/60">Full library</p>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                Every experiment, scored and ready to compare
              </h2>
              <p className="text-sm leading-relaxed text-white/75">
                Search prompts, filter favorites, and drill into responses,
                metrics, and side-by-side variant analysis.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <HeroStat label="Experiments" value={experiments.length.toString()} />
              <HeroStat label="Total runs" value={totalRuns.toString()} />
              <HeroStat
                label="Best score"
                value={bestOverall > 0 ? bestOverall.toFixed(3) : "-"}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90"
              onClick={() => setNewSheetOpen(true)}
            >
              <Sparkles className="size-4" />
              New sweep
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white hover:text-foreground"
              onClick={handleExportAll}
            >
              Export all CSV
            </Button>
          </div>
        </section>

        <BenchmarkPanel />

        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl text-foreground">
                {filtered.length} experiment{filtered.length === 1 ? "" : "s"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sorted by{" "}
                {sortBy === "date"
                  ? "newest first"
                  : sortBy === "score"
                    ? "best score"
                    : "most variants"}
              </p>
            </div>
            <ExperimentFilters
              value={filter}
              onChange={setFilter}
              totalCount={experiments.length}
              favoriteCount={favoriteCount}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-[18px]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-border bg-muted/40 px-6 py-24 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-deep-green/10">
                <FlaskConical className="size-6 text-deep-green" />
              </div>
              <h3 className="font-display text-xl text-foreground">
                {experiments.length === 0
                  ? "No experiments yet"
                  : "No matches for this filter"}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {experiments.length === 0
                  ? "Run your first parameter sweep to populate the library."
                  : "Try clearing search or switching back to all experiments."}
              </p>
              {experiments.length === 0 && (
                <Button className="mt-6" onClick={() => setNewSheetOpen(true)}>
                  <Plus className="size-4" />
                  Create first experiment
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((experiment) => (
                <ExperimentDetailCard
                  key={experiment._id}
                  experiment={experiment}
                  onOpen={openExperiment}
                  onDelete={handleDelete}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  isDeleting={deletingId === experiment._id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <NewExperimentSheet open={newSheetOpen} onOpenChange={setNewSheetOpen} />

      <ExperimentDetailSheet
        experiment={selectedExperiment}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <p className="font-mono-label text-[10px] text-white/60">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums text-white">{value}</p>
    </div>
  );
}
