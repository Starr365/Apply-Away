import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunityDetailLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-40 h-6 rounded-lg" />

      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-80 h-8 rounded-xl" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-12 rounded-xl" />
      </div>

      <Skeleton className="h-12 rounded-2xl" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );
}
