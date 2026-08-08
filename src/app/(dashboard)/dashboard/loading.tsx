import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8 rounded-xl" />
          <Skeleton className="w-72 h-4 rounded-lg" />
        </div>
        <Skeleton className="w-36 h-11 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Filters Skeleton */}
      <Skeleton className="h-16 rounded-2xl" />

      {/* Table / Cards Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}
