import type { Metadata } from "next";
import { ExperimentsPage } from "@/components/experiments/ExperimentsPage";
import { Experiment } from "@/types/experiment";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: "Experiments | LLM Lab",
  description: "Browse every parameter sweep, score, and response in detail",
};

export default async function ExperimentsRoute() {
  let experiments: Experiment[] = [];

  if (BASE_URL) {
    try {
      const res = await fetch(`${BASE_URL}/experiment`, {
        cache: "no-cache",
      });

      if (res.ok) {
        experiments = await res.json();
      }
    } catch {
      // Backend unreachable
    }
  }

  return <ExperimentsPage experiments={experiments} />;
}
