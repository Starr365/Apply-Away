"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, Filter } from "lucide-react";
import { useCallback, useState } from "react";

export function OpportunityFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value.trim() !== "") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset to page 1 on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString("search", search)}`);
  };

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(search || category || status || priority);

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="flex-1 min-w-50 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search opportunity title, organization..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </form>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1 text-xs text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="FELLOWSHIP">Fellowship</option>
          <option value="SCHOLARSHIP">Scholarship</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="JOB">Job</option>
          <option value="GRANT">Grant</option>
          <option value="COMPETITION">Competition</option>
          <option value="RESEARCH">Research</option>
          <option value="CONFERENCE">Conference</option>
          <option value="BOOTCAMP">Bootcamp</option>
          <option value="TRAINING">Training</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="INTERVIEW">Interview</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Priority Dropdown */}
        <select
          value={priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className="h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-11 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
