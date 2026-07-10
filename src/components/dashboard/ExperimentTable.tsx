"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpRight,
  Download,
  FlaskConical,
  Star,
  Trash2,
} from "lucide-react";
import { Experiment } from "@/types/experiment";
import {
  exportExperimentCsv,
  formatScore,
  getExperimentStats,
  scoreTone,
} from "@/lib/experiment-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ExperimentTableProps {
  experiments: Experiment[];
  onOpen: (experiment: Experiment) => void;
  onDelete: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  isDeleting?: string | null;
  isLoading?: boolean;
}

export function ExperimentTable({
  experiments,
  onOpen,
  onDelete,
  isFavorite,
  onToggleFavorite,
  isDeleting,
  isLoading,
}: ExperimentTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (experiments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 py-20 text-center dark:bg-secondary/20">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary">
          <FlaskConical className="size-6 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl">No experiments yet</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Create your first parameter sweep to compare Gemini responses across
          temperature, topP, topK, and token limits.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Prompt</TableHead>
            <TableHead className="hidden md:table-cell">Variants</TableHead>
            <TableHead className="hidden lg:table-cell">Best score</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiments.map((experiment) => {
            const { maxScore, bestIndex } = getExperimentStats(experiment);
            const tone = scoreTone(maxScore);

            return (
              <TableRow
                key={experiment._id}
                className="cursor-pointer"
                onClick={() => onOpen(experiment)}
              >
                <TableCell className="max-w-md">
                  <div className="space-y-1">
                    <p className="line-clamp-2 font-medium leading-snug">
                      {experiment.prompt}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 md:hidden">
                      <Badge variant="muted">{experiment.responses.length} runs</Badge>
                      <Badge
                        variant={tone === "high" ? "success" : tone === "mid" ? "secondary" : "outline"}
                      >
                        {formatScore(maxScore)}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="muted">{experiment.responses.length}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        tone === "high"
                          ? "success"
                          : tone === "mid"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {formatScore(maxScore)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      R{bestIndex + 1}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatDistanceToNow(new Date(experiment.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(isFavorite(experiment._id) && "text-coral")}
                      onClick={() => onToggleFavorite(experiment._id)}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          isFavorite(experiment._id) && "fill-current"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => exportExperimentCsv(experiment)}
                    >
                      <Download className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting === experiment._id}
                      onClick={() => onDelete(experiment._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onOpen(experiment)}>
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
