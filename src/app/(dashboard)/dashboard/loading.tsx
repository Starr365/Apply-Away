import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header Skeleton */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 h-16 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="w-32 h-6 rounded-lg" />
          </div>
          <Skeleton className="w-24 h-8 rounded-xl" />
        </div>
      </header>

      {/* Main Body Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-slate-800/80">
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
      </main>
    </div>
  );
}
