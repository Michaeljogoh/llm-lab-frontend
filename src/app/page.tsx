import Home from "../components/Home";
import { Experiment } from "../types/experiment";

export default async function page() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/experiment`, {
    cache: "no-cache",
  });
  const experiments: Experiment[] = await data.json();
  
  return <Home experiments={experiments} />;
}
