"use client";

import { Opportunity } from "@/domain/opportunity.types";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { OpportunityCard } from "./opportunity-card";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { ExternalLink, Pencil, Trash2, FolderOpen, ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteOpportunityAction } from "@/app/actions/opportunity.actions";

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
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
          <FolderOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold font-outfit text-white">No Opportunities Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No records match your active search or filter criteria. Try resetting filters or adding a new opportunity.
        </p>
      </div>
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
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th
                  onClick={() => handleSort("title")}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Opportunity & Organization</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  Category
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  Status
                </th>
                <th
                  onClick={() => handleSort("priority")}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  Priority
                </th>
                <th
                  onClick={() => handleSort("deadline")}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Deadline</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {opportunities.map((opp) => {
                const deadlineInfo = getDaysRemaining(opp.deadline);
                return (
                  <tr key={opp.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Title & Organization */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm line-clamp-1">{opp.title}</div>
                      <div className="text-slate-400 text-xs">{opp.organization}</div>
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
                      <div className="font-medium text-slate-200">
                        {formatDate(opp.deadline)}
                      </div>
                      <div
                        className={`text-[11px] ${
                          deadlineInfo.isOverdue ? "text-rose-400 font-semibold" : "text-slate-400"
                        }`}
                      >
                        {deadlineInfo.label}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {opp.officialUrl && (
                          <a
                            href={opp.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Official Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(opp)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(opp.id, opp.title)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
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
