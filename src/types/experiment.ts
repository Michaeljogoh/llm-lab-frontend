
export interface Exper { 
  id: string
  parameters:{
  temperature: number;
  topP: number;
  }
  response: string; 
  metrics: { 
  completeness: number,
  coherence: number,
  lengthAppropriateness: number,
  structuralPatterns: number,
  hallucination: number,
  correctness: number,
  wordcount: number,
  readability: number,
  qualityScore: number
  }; 
  score?: number
}


// ExperimentResponseMetrics interface defines quality metrics of each response
interface ExperimentResponseMetrics {
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

// ExperimentResponseParameters defines generation parameters for a response
interface ExperimentResponseParameters {
  temperature: number;
  topP: number;
  topK: number;
  maxToken: number;
}

// Each individual model response within the experiment
export interface ExperimentResponse {
  parameters: ExperimentResponseParameters;
  response: string;
  metrics: ExperimentResponseMetrics;
  score: number;
}

// Main Experiment object from the API
export interface Experiment {
  _id: string;
  title: string;
  prompt: string;
  responses: ExperimentResponse[];
  createdAt: string; 
  updatedAt: string; 
  __v: number;
}
