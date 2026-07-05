"use client";

import { ExperimentResponse } from "@/types/experiment";
import { buildHeatmapFromResponses, formatScore } from "@/lib/experiment-utils";
import { cn } from "@/lib/utils";

interface ParameterHeatmapProps {
  responses: ExperimentResponse[];
  className?: string;
}

export function ParameterHeatmap({ responses, className }: ParameterHeatmapProps) {
  const cells = buildHeatmapFromResponses(responses);

  if (cells.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Run more variants to populate the heatmap.</p>
    );
  }

  const temps = [...new Set(cells.map((c) => c.temperature))].sort((a, b) => a - b);
  const topPs = [...new Set(cells.map((c) => c.topP))].sort((a, b) => a - b);
  const maxScore = Math.max(...cells.map((c) => c.avgScore), 0.001);

  const lookup = new Map(
    cells.map((c) => [`${c.temperature}|${c.topP}`, c.avgScore])
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono-label text-[10px] text-muted-foreground">
          Temperature × Top P (avg score)
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Low</span>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-muted via-deep-green/60 to-deep-green dark:from-white/10" />
          <span>High</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left font-mono-label text-muted-foreground">T \\ P</th>
              {topPs.map((p) => (
                <th key={p} className="p-2 font-mono text-muted-foreground">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {temps.map((t) => (
              <tr key={t}>
                <td className="p-2 text-left font-mono text-muted-foreground">{t}</td>
                {topPs.map((p) => {
                  const score = lookup.get(`${t}|${p}`);
                  const intensity = score ? score / maxScore : 0;
                  return (
                    <td key={p} className="p-1">
                      <div
                        className={cn(
                          "rounded-md border border-border px-2 py-3 font-mono tabular-nums",
                          score && intensity > 0.55
                            ? "text-white"
                            : "text-foreground",
                          !score && "bg-muted/30"
                        )}
                        style={
                          score
                            ? {
                                backgroundColor: `hsl(168 48% 28% / ${0.12 + intensity * 0.78})`,
                              }
                            : undefined
                        }
                        title={score ? `Avg ${formatScore(score)}` : "No data"}
                      >
                        {score ? formatScore(score) : "—"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
