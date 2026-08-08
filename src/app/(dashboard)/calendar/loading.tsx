import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="w-64 h-8 rounded-xl" />
        <Skeleton className="w-80 h-4 rounded-lg" />
      </div>

      <Skeleton className="h-14 rounded-2xl" />
      <Skeleton className="h-125 rounded-3xl" />
    </div>
  );
}
