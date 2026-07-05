import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  Experiment,
  ExperimentResponse,
  HeatmapCell,
  ScoringWeights,
} from "@/types/experiment";

export function countCombinations(
  temperature: number[],
  topP: number[],
  topK: number[],
  maxToken: number[]
): number {
  return temperature.length * topP.length * topK.length * maxToken.length;
}

export function buildSteppedValues(
  max: number,
  step: number,
  min = step
): number[] {
  const values: number[] = [];
  for (let i = min; i <= max + step / 2; i += step) {
    values.push(parseFloat(i.toFixed(2)));
  }
  return values;
}

export function buildTokenValues(max: number): number[] {
  const values: number[] = [];
  for (let i = 100; i <= max; i += 100) {
    values.push(i);
  }
  return values;
}

export function getExperimentStats(experiment: Experiment) {
  const scores = experiment.responses.map((r) => r.score);
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const avgScore = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
  const bestIndex = experiment.responses.reduce(
    (best, response, index) =>
      response.score > experiment.responses[best].score ? index : best,
    0
  );

  return { maxScore, avgScore, bestIndex };
}

export function exportExperimentCsv(experiment: Experiment) {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: `llm-lab-${experiment._id.slice(-6)}`,
  });

  const rows = experiment.responses.map((response, index) => ({
    experimentId: experiment._id,
    prompt: experiment.prompt,
    responseIndex: index + 1,
    temperature: response.parameters.temperature,
    topP: response.parameters.topP,
    topK: response.parameters.topK,
    maxToken: response.parameters.maxToken,
    score: response.score,
    completeness: response.metrics.completeness,
    coherence: response.metrics.coherence,
    lengthAppropriateness: response.metrics.lengthAppropriateness,
    structuralPatterns: response.metrics.structuralPatterns,
    hallucination: response.metrics.hallucination,
    correctness: response.metrics.correctness,
    readability: response.metrics.readability,
    wordcount: response.metrics.wordcount,
    response: response.response,
  }));

  const csv = generateCsv(csvConfig)(rows);
  download(csvConfig)(csv);
}

export function exportAllExperimentsCsv(experiments: Experiment[]) {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: "llm-lab-all-experiments",
  });

  const rows = experiments.flatMap((experiment) =>
    experiment.responses.map((response, index) => ({
      experimentId: experiment._id,
      title: experiment.title,
      prompt: experiment.prompt,
      createdAt: experiment.createdAt,
      responseIndex: index + 1,
      temperature: response.parameters.temperature,
      topP: response.parameters.topP,
      topK: response.parameters.topK,
      maxToken: response.parameters.maxToken,
      score: response.score,
      completeness: response.metrics.completeness,
      coherence: response.metrics.coherence,
      response: response.response,
    }))
  );

  if (rows.length === 0) return false;

  const csv = generateCsv(csvConfig)(rows);
  download(csvConfig)(csv);
  return true;
}

export function sortExperiments(
  experiments: Experiment[],
  sortBy: "date" | "score" | "variations"
): Experiment[] {
  return [...experiments].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "variations") {
      return b.responses.length - a.responses.length;
    }
    return getExperimentStats(b).maxScore - getExperimentStats(a).maxScore;
  });
}

export function filterExperiments(
  experiments: Experiment[],
  query: string
): Experiment[] {
  const q = query.trim().toLowerCase();
  if (!q) return experiments;
  return experiments.filter(
    (e) =>
      e.prompt.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      (e.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
  );
}

export function formatScore(score: number): string {
  return score.toFixed(3);
}

export function scoreTone(score: number): "high" | "mid" | "low" {
  if (score >= 0.7) return "high";
  if (score >= 0.45) return "mid";
  return "low";
}

export const METRIC_LABELS: Record<
  keyof Omit<ExperimentResponse["metrics"], "qualityScore" | "wordcount">,
  string
> = {
  completeness: "Completeness",
  coherence: "Coherence",
  lengthAppropriateness: "Length fit",
  structuralPatterns: "Structure",
  hallucination: "Grounding",
  correctness: "Correctness",
  readability: "Readability",
};

export function exportExperimentJson(experiment: Experiment) {
  const blob = new Blob([JSON.stringify(experiment, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `llm-lab-${experiment._id.slice(-6)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportJupyterNotebook(experiment: Experiment) {
  const notebook = {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: [`# LLM Lab — ${experiment.title}\n`, `\nPrompt: ${experiment.prompt}\n`],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "import pandas as pd\n",
          "import json\n",
          `\ndata = json.loads('''${JSON.stringify(experiment.responses).replace(/'/g, "\\'")}''')\n`,
          "df = pd.DataFrame([\n",
          "  {**r['parameters'], 'score': r['score'], 'response': r['response'][:120]}\n",
          "  for r in data\n",
          "])\n",
          "df.sort_values('score', ascending=False)",
        ],
      },
    ],
    metadata: {
     kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python", version: "3.11.0" },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };

  const blob = new Blob([JSON.stringify(notebook, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `llm-lab-${experiment._id.slice(-6)}.ipynb`;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildHeatmapFromResponses(
  responses: ExperimentResponse[]
): HeatmapCell[] {
  const cells = new Map<string, { sum: number; count: number }>();

  for (const row of responses) {
    const key = `${row.parameters.temperature}|${row.parameters.topP}`;
    const cell = cells.get(key) ?? { sum: 0, count: 0 };
    cell.sum += row.score;
    cell.count += 1;
    cells.set(key, cell);
  }

  return [...cells.entries()].map(([key, { sum, count }]) => {
    const [temperature, topP] = key.split("|").map(Number);
    return {
      temperature,
      topP,
      avgScore: +(sum / count).toFixed(3),
      count,
    };
  });
}

export function computeWeightedScore(
  response: ExperimentResponse,
  weights: ScoringWeights
): number {
  const m = response.metrics;
  const w = weights;
  const totalWeight =
    w.completeness +
    w.coherence +
    w.lengthAppropriateness +
    w.structuralPatterns +
    w.hallucination +
    w.correctness +
    w.readability;

  const sum =
    m.completeness * w.completeness +
    m.coherence * w.coherence +
    m.lengthAppropriateness * w.lengthAppropriateness +
    m.structuralPatterns * w.structuralPatterns +
    m.hallucination * w.hallucination +
    m.correctness * w.correctness +
    m.readability * w.readability;

  return +(sum / totalWeight).toFixed(3);
}

export function diffWords(a: string, b: string): { added: string[]; removed: string[] } {
  const setA = new Set(a.toLowerCase().split(/\s+/));
  const setB = new Set(b.toLowerCase().split(/\s+/));
  return {
    added: [...setB].filter((w) => !setA.has(w)).slice(0, 40),
    removed: [...setA].filter((w) => !setB.has(w)).slice(0, 40),
  };
}
