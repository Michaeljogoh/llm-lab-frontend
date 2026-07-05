export type ScoringWeights = {
  completeness: number;
  coherence: number;
  lengthAppropriateness: number;
  structuralPatterns: number;
  hallucination: number;
  correctness: number;
  readability: number;
};

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  completeness: 1,
  coherence: 1,
  lengthAppropriateness: 1,
  structuralPatterns: 1,
  hallucination: 1,
  correctness: 1,
  readability: 1,
};

export type ExperimentStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "paused";

export interface ExperimentProgress {
  completed: number;
  total: number;
  failed: number;
}

export interface RunConfig {
  temperature: number[];
  topP: number[];
  topK: number[];
  maxToken: number[];
}

export interface SuggestedSweep {
  message: string;
  runConfig: RunConfig;
  topParameter: string;
}

export interface RegressionResult {
  baselineScore: number;
  newScore: number;
  delta: number;
  passed: boolean;
  baselineExperimentId: string;
}

export interface ExperimentResponseMetrics {
  completeness: number;
  coherence: number;
  lengthAppropriateness: number;
  structuralPatterns: number;
  hallucination: number;
  correctness: number;
  wordcount: number;
  readability: number;
  qualityScore: number;
}

export interface ExperimentResponseParameters {
  temperature: number;
  topP: number;
  topK: number;
  maxToken: number;
}

export interface ExperimentResponse {
  parameters: ExperimentResponseParameters;
  response: string;
  metrics: ExperimentResponseMetrics;
  score: number;
  model?: string;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
  judgeScore?: number;
  judgeRationale?: string;
  humanRating?: "up" | "down" | null;
}

export interface Experiment {
  _id: string;
  title: string;
  prompt: string;
  systemPrompt?: string;
  tags?: string[];
  responses: ExperimentResponse[];
  status?: ExperimentStatus;
  progress?: ExperimentProgress;
  models?: string[];
  runConfig?: RunConfig;
  scoringWeights?: ScoringWeights;
  enableJudge?: boolean;
  isPublic?: boolean;
  shareToken?: string;
  parentExperimentId?: string;
  suggestedNextSweep?: SuggestedSweep;
  regressionResult?: RegressionResult;
  benchmarkSuiteId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HeatmapCell {
  temperature: number;
  topP: number;
  avgScore: number;
  count: number;
}

export interface PromptPreset {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  prompt: string;
  tags: string[];
  temperature: number[];
  topP: number[];
  topK: number[];
  maxToken: number[];
}

export interface CreateExperimentPayload {
  prompt: string;
  systemPrompt?: string;
  temperature: number[];
  topP: number[];
  topK: number[];
  maxToken: number[];
  tags?: string[];
  models?: string[];
  scoringWeights?: ScoringWeights;
  enableJudge?: boolean;
}
