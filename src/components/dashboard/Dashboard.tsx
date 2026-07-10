"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Experiment } from "@/types/experiment";
import {
  exportAllExperimentsCsv,
  filterExperiments,
  sortExperiments,
} from "@/lib/experiment-utils";
import { useFavorites } from "@/hooks/use-favorites";
import {
  useExperiments,
  useInvalidateExperiments,
} from "@/hooks/use-experiments";
import { AnnouncementBar } from "./AnnouncementBar";
import { AppHeader } from "./AppHeader";
import { StatsBar } from "./StatsBar";
import { HomeHero } from "./HomeHero";
import { FeatureGrid } from "./FeatureGrid";
import { WorkflowStrip } from "./WorkflowStrip";
import { BenchmarkPanel } from "@/components/experiments/BenchmarkPanel";
import { MetricsShowcase } from "./MetricsShowcase";
import { QuickStartPanel } from "./QuickStartPanel";
import { RecentActivity } from "./RecentActivity";
import {
  ExperimentFilters,
  type ExperimentFilter,
} from "./ExperimentFilters";
import { ExperimentTable } from "./ExperimentTable";
import { NewExperimentSheet } from "./NewExperimentSheet";
import { ExperimentDetailSheet } from "./ExperimentDetailSheet";

export function Dashboard() {
  const router = useRouter();
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

  const previewExperiments = useMemo(() => {
    let list = filterExperiments(experiments, search);
    if (filter === "favorites") {
      list = list.filter((experiment) => favorites.has(experiment._id));
    }
    return sortExperiments(list, "date").slice(0, 5);
  }, [experiments, search, filter, favorites]);

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

  const scrollToExperiments = () => {
    router.push("/experiments");
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <AnnouncementBar />

      <AppHeader
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onNewExperiment={() => setNewSheetOpen(true)}
        onExportAll={handleExportAll}
      />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6">
        <HomeHero
          experimentCount={experiments.length}
          totalRuns={totalRuns}
          onNewExperiment={() => setNewSheetOpen(true)}
          onViewExperiments={scrollToExperiments}
        />

        <StatsBar experiments={experiments} />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <FeatureGrid />
            <MetricsShowcase />
            <WorkflowStrip />
            <BenchmarkPanel />

            <section id="experiments-section" className="space-y-4 scroll-mt-24">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-2xl text-foreground">
                    Experiment library
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Latest five sweeps — open the full library for every run.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ExperimentFilters
                    value={filter}
                    onChange={setFilter}
                    totalCount={experiments.length}
                    favoriteCount={favoriteCount}
                  />
                  {experiments.length > 0 && (
                    <Link
                      href="/experiments"
                      className="hover-black inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
                    >
                      View all ({experiments.length})
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              <ExperimentTable
                experiments={previewExperiments}
                onOpen={openExperiment}
                onDelete={handleDelete}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                isDeleting={deletingId}
                isLoading={isLoading}
              />
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <QuickStartPanel
              favoriteCount={favoriteCount}
              onNewExperiment={() => setNewSheetOpen(true)}
              onExportAll={handleExportAll}
            />
            <RecentActivity experiments={experiments} onOpen={openExperiment} />
          </aside>
        </div>
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
