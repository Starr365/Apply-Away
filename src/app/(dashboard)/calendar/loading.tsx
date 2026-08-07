import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <header className="border-b border-slate-800/60 bg-slate-950/80 h-16 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="w-32 h-6 rounded-lg" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="w-64 h-8 rounded-xl" />
          <Skeleton className="w-80 h-4 rounded-lg" />
        </div>

        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-125 rounded-3xl" />
      </main>
    </div>
  );
}
