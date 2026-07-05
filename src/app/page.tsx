import { Dashboard } from "@/components/dashboard/Dashboard";
import { Experiment } from "@/types/experiment";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Page() {
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

  return <Dashboard experiments={experiments} />;
}
