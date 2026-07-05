import { Skeleton } from "@/components/ui/skeleton";

export default function ExperimentsLoading() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <Skeleton className="h-12 w-full max-w-7xl mx-auto" />
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <Skeleton className="h-64 w-full rounded-[22px]" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full rounded-[18px]" />
          <Skeleton className="h-96 w-full rounded-[18px]" />
        </div>
      </div>
    </div>
  );
}
