"use client";

import { Opportunity } from "@/domain/opportunity.types";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { OpportunityCard } from "./opportunity-card";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { ExternalLink, Pencil, Trash2, FolderOpen, ArrowUpDown, Eye } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteOpportunityAction } from "@/app/actions/opportunity.actions";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onEdit: (opp: Opportunity) => void;
}

export function OpportunityTable({ opportunities, onEdit }: OpportunityTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSortBy === field) {
      params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "asc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    await deleteOpportunityAction(id);
  };

  if (opportunities.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Opportunities Found"
        description="No records match your active search or filter criteria. Try resetting filters or adding a new opportunity."
        className="glass-panel"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Grid View (Hidden on Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} onEdit={onEdit} />
        ))}
      </div>

      {/* Desktop Data Table View (Hidden on Mobile) */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th
                  onClick={() => handleSort("title")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Opportunity & Organization</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Category
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Status
                </th>
                <th
                  onClick={() => handleSort("priority")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Priority
                </th>
                <th
                  onClick={() => handleSort("deadline")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Deadline</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {opportunities.map((opp) => {
                const deadlineInfo = getDaysRemaining(opp.deadline);
                return (
                  <tr key={opp.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors">
                    {/* Title & Organization */}
                    <td className="py-3.5 px-4">
                      {opp.officialUrl || opp.applicationUrl ? (
                        <a
                          href={opp.officialUrl || opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-primary hover:underline text-sm line-clamp-1 inline-flex items-center gap-1 group"
                        >
                          <span>{opp.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <div className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{opp.title}</div>
                      )}
                      <div className="text-slate-500 dark:text-slate-400 text-xs">{opp.organization}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={opp.category} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={opp.status} />
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={opp.priority} />
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {formatDate(opp.deadline)}
                      </div>
                      <div
                        className={`text-[11px] ${
                          deadlineInfo.isOverdue ? "text-rose-500 dark:text-rose-400 font-semibold" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {deadlineInfo.label}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onEdit(opp)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(opp.id, opp.title)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
