"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Experiment } from "@/types/experiment";
import { ExperimentDetailCard } from "./ExperimentDetailCard";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { useState } from "react";

interface SharedExperimentViewProps {
  experiment: Experiment;
  readOnly?: boolean;
}

export function SharedExperimentView({
  experiment: initial,
  readOnly,
}: SharedExperimentViewProps) {
  const [search, setSearch] = useState("");
  const experiment = initial;

  return (
    <div className="min-h-dvh bg-background">
      {!readOnly && (
        <AppHeader
          search={search}
          onSearchChange={setSearch}
          sortBy="date"
          onSortChange={() => undefined}
          onNewExperiment={() => undefined}
          onExportAll={() => undefined}
        />
      )}

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {readOnly ? (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            LLM Lab
          </Link>
        ) : null}

        <div className="space-y-2">
          <p className="font-mono-label text-muted-foreground">
            {readOnly ? "Shared experiment" : "Experiment"}
          </p>
          <h1 className="font-display text-2xl text-foreground">{experiment.prompt}</h1>
        </div>

        <ExperimentDetailCard
          experiment={experiment}
          onOpen={() => undefined}
          onDelete={() => undefined}
          isFavorite={() => false}
          onToggleFavorite={() => undefined}
          readOnly={readOnly}
        />
      </main>
    </div>
  );
}
