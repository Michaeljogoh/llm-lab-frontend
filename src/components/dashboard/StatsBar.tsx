"use client";

import { Experiment } from "@/types/experiment";
import { getExperimentStats } from "@/lib/experiment-utils";
import { FlaskConical, Layers, TrendingUp, Zap } from "lucide-react";

interface StatsBarProps {
  experiments: Experiment[];
}

export function StatsBar({ experiments }: StatsBarProps) {
  const totalRuns = experiments.reduce((sum, e) => sum + e.responses.length, 0);
  const bestScore = experiments.reduce((max, e) => {
    const { maxScore } = getExperimentStats(e);
    return Math.max(max, maxScore);
  }, 0);
  const avgVariations =
    experiments.length > 0
      ? Math.round(totalRuns / experiments.length)
      : 0;

  const stats = [
    {
      label: "Experiments",
      value: experiments.length.toString(),
      icon: FlaskConical,
    },
    {
      label: "Total runs",
      value: totalRuns.toString(),
      icon: Zap,
    },
    {
      label: "Best score",
      value: bestScore > 0 ? bestScore.toFixed(3) : "-",
      icon: TrendingUp,
    },
    {
      label: "Avg variants",
      value: avgVariations.toString(),
      icon: Layers,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-white/10 bg-deep-green p-4 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-white/10">
              <stat.icon className="size-4 text-white/80" />
            </div>
            <div>
              <p className="font-mono-label text-white/60">{stat.label}</p>
              <p className="font-display text-xl text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
