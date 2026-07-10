import type { Metadata } from "next";
import { ExperimentsPage } from "@/components/experiments/ExperimentsPage";

export const metadata: Metadata = {
  title: "Experiments | LLM Lab",
  description: "Browse every parameter sweep, score, and response in detail",
};

export default function ExperimentsRoute() {
  return <ExperimentsPage />;
}
