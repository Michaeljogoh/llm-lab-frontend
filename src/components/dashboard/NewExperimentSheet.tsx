"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { countCombinations } from "@/lib/experiment-utils";
import { getApiClient } from "@/lib/api-client";
import { ParameterSliders } from "./ParameterSliders";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DEFAULT_SCORING_WEIGHTS,
  Experiment,
  ScoringWeights,
} from "@/types/experiment";
import { SystemPromptField } from "@/components/experiments/SystemPromptField";
import { MultiModelSelect } from "@/components/experiments/MultiModelSelect";
import { ScoringWeightsPanel } from "@/components/experiments/ScoringWeightsPanel";
import { PromptPresetsPicker } from "@/components/experiments/PromptPresetsPicker";
import { TagsEditor } from "@/components/experiments/TagsEditor";
import { useExperimentPoll } from "@/hooks/use-experiment-poll";
import { ExperimentProgressBanner } from "@/components/experiments/ExperimentProgressBanner";

interface NewExperimentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewExperimentSheet({ open, onOpenChange }: NewExperimentSheetProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>(["gemini-2.0-flash-001"]);
  const [scoringWeights, setScoringWeights] =
    useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  const [enableJudge, setEnableJudge] = useState(false);
  const [temperature, setTemperature] = useState<number[]>([0.1, 0.2]);
  const [topP, setTopP] = useState<number[]>([0.1, 0.2]);
  const [topK, setTopK] = useState<number[]>([0.1, 0.2]);
  const [maxToken, setMaxToken] = useState<number[]>([100, 200]);
  const [activeExperimentId, setActiveExperimentId] = useState<string | null>(null);

  const paramCombinations = countCombinations(temperature, topP, topK, maxToken);
  const combinations = paramCombinations * Math.max(models.length, 1);

  const { status, progress, percent } = useExperimentPoll(
    activeExperimentId,
    !!activeExperimentId,
    () => {
      toast.success("Experiment completed");
      router.refresh();
      resetForm();
      setActiveExperimentId(null);
      onOpenChange(false);
    }
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await getApiClient().post<Experiment>("/experiment", {
        prompt,
        systemPrompt,
        tags,
        models,
        scoringWeights,
        enableJudge,
        temperature,
        topP,
        topK,
        maxToken,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Sweep queued — running in background");
      setActiveExperimentId(data._id);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to start experiment");
    },
  });

  const resetForm = () => {
    setPrompt("");
    setSystemPrompt("");
    setTags([]);
    setModels(["gemini-2.0-flash-001"]);
    setScoringWeights(DEFAULT_SCORING_WEIGHTS);
    setEnableJudge(false);
    setTemperature([0.1, 0.2]);
    setTopP([0.1, 0.2]);
    setTopK([0.1, 0.2]);
    setMaxToken([100, 200]);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Enter a prompt before running");
      return;
    }
    if (temperature.length < 2) {
      toast.error("Set at least two temperature values");
      return;
    }
    if (models.length === 0) {
      toast.error("Select at least one model");
      return;
    }
    if (combinations > 48) {
      toast.error("Too many combinations. Reduce ranges (max 48).");
      return;
    }
    mutation.mutate();
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!mutation.isPending && !activeExperimentId) handleSubmit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, mutation.isPending, activeExperimentId, prompt, combinations]);

  const isBusy = mutation.isPending || !!activeExperimentId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>New experiment</SheetTitle>
          <SheetDescription>
            Sweep parameters across models with custom scoring and optional LLM judge.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-2 pr-4">
            <PromptPresetsPicker
              onSelect={(preset) => {
                setPrompt(preset.prompt);
                setSystemPrompt(preset.systemPrompt);
                setTags(preset.tags);
                setTemperature(preset.temperature);
                setTopP(preset.topP);
                setTopK(preset.topK);
                setMaxToken(preset.maxToken);
              }}
            />

            <SystemPromptField
              value={systemPrompt}
              onChange={setSystemPrompt}
              disabled={isBusy}
            />

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write the prompt you want to test across parameter combinations..."
                disabled={isBusy}
              />
            </div>

            <TagsEditor tags={tags} onChange={setTags} />

            <MultiModelSelect
              selected={models}
              onChange={setModels}
              disabled={isBusy}
            />

            <ParameterSliders
              temperature={temperature}
              topP={topP}
              topK={topK}
              maxToken={maxToken}
              onTemperatureChange={setTemperature}
              onTopPChange={setTopP}
              onTopKChange={setTopK}
              onMaxTokenChange={setMaxToken}
            />

            <ScoringWeightsPanel value={scoringWeights} onChange={setScoringWeights} />

            <div className="flex items-center gap-2 rounded-lg border border-border p-3">
              <Checkbox
                id="enable-judge"
                checked={enableJudge}
                onCheckedChange={(v) => setEnableJudge(!!v)}
                disabled={isBusy}
              />
              <Label htmlFor="enable-judge" className="text-sm">
                Run LLM-as-judge on each variant (slower, extra API calls)
              </Label>
            </div>

            <div className="rounded-lg border border-border bg-deep-green/5 p-4 dark:bg-accent/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono-label text-muted-foreground">Run preview</p>
                  <p className="mt-1 text-sm">
                    {combinations} API call{combinations === 1 ? "" : "s"} queued
                  </p>
                </div>
                <Badge variant={combinations > 48 ? "coral" : "success"}>
                  {combinations}/48 max
                </Badge>
              </div>
            </div>

            {activeExperimentId && (
              <ExperimentProgressBanner
                status={status}
                progress={progress}
                percent={percent}
              />
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2 sm:justify-between">
          <p className="self-center text-xs text-muted-foreground">
            Tip: Cmd+Enter to run
          </p>
          <Button
            onClick={handleSubmit}
            disabled={isBusy || combinations > 48}
            className="min-w-32"
          >
            {isBusy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Run sweep
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
