import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}
