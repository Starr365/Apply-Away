"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OpportunityPaginationProps {
  totalItems: number;
  currentPage: number;
  limit: number;
}

export function OpportunityPagination({
  totalItems,
  currentPage,
  limit,
}: OpportunityPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalItems <= limit) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-400">
      <div>
        Showing <span className="text-white font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="text-white font-medium">
          {Math.min(currentPage * limit, totalItems)}
        </span>{" "}
        of <span className="text-white font-medium">{totalItems}</span> opportunities
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-purple-300 font-semibold">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
