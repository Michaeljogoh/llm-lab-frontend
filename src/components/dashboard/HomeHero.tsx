"use client";

import {
  ArrowRight,
  BarChart3,
  GitCompare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface HomeHeroProps {
  experimentCount: number;
  totalRuns: number;
  onNewExperiment: () => void;
  onViewExperiments: () => void;
}

export function HomeHero({
  experimentCount,
  totalRuns,
  onNewExperiment,
  onViewExperiments,
}: HomeHeroProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
      <div className="flex flex-col justify-center space-y-6 py-2">
        <div className="space-y-4">
          <Badge variant="coral" className="w-fit">
            Gemini parameter lab
          </Badge>
          <h2 className="font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Find the best generation settings for every prompt.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Run matrix sweeps, score responses across eight quality signals, and
            pin the winning variant without leaving the bench.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={onNewExperiment}>
            <Sparkles className="size-4" />
            Start new sweep
          </Button>
          <Button variant="outline" size="lg" onClick={onViewExperiments}>
            View experiments
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-6 border-t border-border pt-5">
          <div>
            <p className="font-display text-2xl text-foreground">{experimentCount}</p>
            <p className="text-xs text-muted-foreground">Saved experiments</p>
          </div>
          <div>
            <p className="font-display text-2xl text-foreground">{totalRuns}</p>
            <p className="text-xs text-muted-foreground">Scored responses</p>
          </div>
          <div>
            <p className="font-display text-2xl text-foreground">8</p>
            <p className="text-xs text-muted-foreground">Quality metrics</p>
          </div>
        </div>
      </div>

      <div className="card-dark cursor-default overflow-hidden rounded-[22px] p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono-label text-[10px] text-white/60">Live bench</p>
            <p className="font-display text-lg text-white">Agent console</p>
          </div>
          <Badge className="chip-dark shrink-0 border-0">
            Running sweep
          </Badge>
        </div>

        <div className="bench-panel space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-[background-color,border-color] duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/60">Prompt</p>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white">
                Explain quantum entanglement for a curious teenager.
              </p>
            </div>
            <Badge className="chip-dark shrink-0 border-0">12 variants</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Temp", value: "0.3" },
              { label: "Top P", value: "0.5" },
              { label: "Top K", value: "0.4" },
              { label: "Tokens", value: "300" },
            ].map((param) => (
              <div
                key={param.label}
                className="bench-tile rounded-md border border-white/10 bg-white/5 px-2 py-2 transition-[background-color,border-color] duration-200"
              >
                <p className="font-mono-label text-[9px] text-white/60">
                  {param.label}
                </p>
                <p className="mt-1 font-mono text-sm text-white">{param.value}</p>
              </div>
            ))}
          </div>

          <div className="bench-panel space-y-2 rounded-md border border-white/10 bg-white/5 p-3 transition-[background-color,border-color] duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Best response</span>
              <span className="font-mono text-white">0.842</span>
            </div>
            <Progress value={84} className="h-1 bg-white/10 [&>div]:bg-white/70" />
            <p className="line-clamp-2 text-xs leading-relaxed text-white/80">
              Entanglement is when two particles stay linked, so measuring one
              instantly tells you something about the other.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/60">
          <span className="inline-flex items-center gap-1.5 text-white/60">
            <GitCompare className="size-3.5 text-white/60" />
            Compare 2 variants
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/60">
            <BarChart3 className="size-3.5 text-white/60" />
            Rank by score
          </span>
        </div>
      </div>
    </section>
  );
}
