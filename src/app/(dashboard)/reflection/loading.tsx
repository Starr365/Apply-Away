import { Skeleton } from "@/components/ui/skeleton";

export default function ReflectionLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="w-72 h-8 rounded-xl" />
        <Skeleton className="w-96 h-4 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}
