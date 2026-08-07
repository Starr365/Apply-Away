import { EmptyState } from "@/components/ui/empty-state";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <EmptyState
        icon={FileQuestion}
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
          >
            <span>Go Home</span>
          </Link>
        }
      />
    </div>
  );
}
