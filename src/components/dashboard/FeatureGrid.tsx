"use client";

import {
  Download,
  GitCompare,
  Layers,
  LineChart,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Parameter matrix",
    description:
      "Sweep temperature, topP, topK, and max tokens. Every combination runs automatically.",
    icon: SlidersHorizontal,
    accent: "bg-action-blue/10 text-action-blue",
    span: "lg:col-span-2",
  },
  {
    title: "Quality scoring",
    description:
      "Eight heuristic signals score completeness, coherence, grounding, and readability.",
    icon: LineChart,
    accent: "bg-deep-green/10 text-deep-green dark:text-chart-2",
    span: "",
  },
  {
    title: "Side-by-side compare",
    description: "Pin two responses and inspect parameters plus full metric breakdowns.",
    icon: GitCompare,
    accent: "bg-coral/10 text-coral",
    span: "",
  },
  {
    title: "Favorites and export",
    description: "Star winning runs and export full result matrices to CSV.",
    icon: Star,
    accent: "bg-secondary text-muted-foreground",
    span: "",
  },
  {
    title: "Batch orchestration",
    description:
      "Preview combination count before you run. Guardrails keep free-tier quotas in check.",
    icon: Layers,
    accent: "bg-muted text-muted-foreground",
    span: "lg:col-span-2",
  },
  {
    title: "Research export",
    description: "Download every response, score, and parameter set for offline analysis.",
    icon: Download,
    accent: "bg-primary/5 text-primary dark:text-foreground",
    span: "",
  },
];

export function FeatureGrid() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-xl text-foreground">Built for experimenters</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you need to iterate on prompts and generation settings.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={cn(
              "card-surface group cursor-default overflow-hidden border-border/80",
              feature.span
            )}
          >
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div
                className={cn(
                  "icon-tile flex size-10 items-center justify-center rounded-lg",
                  feature.accent
                )}
              >
                <feature.icon className="size-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
