"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "@/lib/api-client";
import { Experiment } from "@/types/experiment";

export const EXPERIMENTS_QUERY_KEY = ["experiments"] as const;

async function fetchExperiments(): Promise<Experiment[]> {
  const { data } = await getApiClient().get<Experiment[]>("/experiment");
  return data;
}

export function useExperiments() {
  return useQuery({
    queryKey: EXPERIMENTS_QUERY_KEY,
    queryFn: fetchExperiments,
    staleTime: 30_000,
  });
}

export function useInvalidateExperiments() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: EXPERIMENTS_QUERY_KEY });
}
