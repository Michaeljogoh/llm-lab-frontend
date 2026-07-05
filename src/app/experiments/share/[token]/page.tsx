import { SharedExperimentView } from "@/components/experiments/SharedExperimentView";
import { Experiment } from "@/types/experiment";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function ShareExperimentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let experiment: Experiment | null = null;

  if (BASE_URL) {
    try {
      const res = await fetch(`${BASE_URL}/experiment/share/${token}`, {
        cache: "no-cache",
      });
      if (res.ok) experiment = await res.json();
    } catch {
      // unreachable
    }
  }

  if (!experiment) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <p className="text-muted-foreground">Shared experiment not found or link expired.</p>
      </div>
    );
  }

  return <SharedExperimentView experiment={experiment} readOnly />;
}
