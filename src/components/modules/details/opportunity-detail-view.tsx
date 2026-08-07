"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Opportunity, ActivityLog } from "@/domain/opportunity.types";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { updateEssayDraftAction, updatePersonalNotesAction } from "@/app/actions/detail.actions";
import {
  ArrowLeft,
  Building,
  ExternalLink,
  Clock,
  Pencil,
  CheckCircle2,
  FileText,
  ListCheck,
  History,
  Save,
  Globe,
  Award,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { OpportunityFormModal } from "@/components/modules/opportunity/opportunity-form-modal";

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  activityLogs: ActivityLog[];
}

export function OpportunityDetailView({
  opportunity,
  activityLogs,
}: OpportunityDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "essays" | "checklist" | "notes" | "timeline"
  >("overview");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notes, setNotes] = useState(opportunity.personalNotes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState(false);

  // Essay drafts state map
  const [essayDrafts, setEssayDrafts] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    opportunity.essayQuestions.forEach((q) => {
      if (q.id) map[q.id] = q.draftResponse || "";
    });
    return map;
  });
  const [savingEssayId, setSavingEssayId] = useState<string | null>(null);

  // Interactive Checklist State
  const defaultChecklistItems = [
    { key: "resume", label: "Update & Tailor Resume / CV" },
    { key: "transcript", label: "Request Academic Transcripts" },
    { key: "passport", label: "Verify Passport / ID Validity" },
    { key: "recommendation", label: "Request Recommendation Letters" },
    { key: "essays", label: "Complete Essay Drafts" },
    { key: "portfolio", label: "Update Portfolio / GitHub" },
    { key: "review", label: "Final Review of Application" },
    { key: "submit", label: "Submit Official Application" },
  ];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    // If status is submitted, auto-check submission
    return {
      submit: opportunity.status === "SUBMITTED" || opportunity.status === "ACCEPTED",
    };
  });

  const deadlineInfo = getDaysRemaining(opportunity.deadline);

  const handleToggleChecklist = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setNotesSuccess(false);
    try {
      const res = await updatePersonalNotesAction(opportunity.id, notes);
      if (res.success) {
        toast.success("Personal vault notes saved!");
        setNotesSuccess(true);
        setTimeout(() => setNotesSuccess(false), 3000);
      } else {
        toast.error(res.error || "Failed to save notes.");
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
      toast.error("Failed to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSaveEssayDraft = async (essayId: string) => {
    setSavingEssayId(essayId);
    try {
      const res = await updateEssayDraftAction(essayId, essayDrafts[essayId] || "");
      if (res.success) {
        toast.success("Essay draft response saved!");
      } else {
        toast.error(res.error || "Failed to save draft.");
      }
    } catch (err) {
      console.error("Failed to save essay draft:", err);
      toast.error("Failed to save draft.");
    } finally {
      setSavingEssayId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault Dashboard</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Opportunity</span>
        </button>
      </div>

      {/* Main Opportunity Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-purple-400 font-semibold">
              <Building className="w-4 h-4" />
              <span>{opportunity.organization}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
              {opportunity.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={opportunity.category} />
            <StatusBadge status={opportunity.status} />
            <PriorityBadge priority={opportunity.priority} />
          </div>
        </div>

        {/* Links & Deadline Bar */}
        <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock
              className={`w-4 h-4 ${
                deadlineInfo.isOverdue ? "text-rose-400" : "text-amber-400"
              }`}
            />
            <span className="font-medium">
              Deadline:{" "}
              <strong className={deadlineInfo.isOverdue ? "text-rose-400" : "text-white"}>
                {formatDate(opportunity.deadline)} ({deadlineInfo.label})
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {opportunity.officialUrl && (
              <a
                href={opportunity.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-purple-300 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Official Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/20 transition-all"
              >
                <span>Apply Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Detail Tab Navigation Bar */}
      <div className="flex rounded-2xl bg-slate-900/90 p-1.5 border border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-1 min-w-27.5 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("essays")}
          className={`flex-1 min-w-27.5 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "essays"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Essay Prompts ({opportunity.essayQuestions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={`flex-1 min-w-27.5 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "checklist"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ListCheck className="w-3.5 h-3.5" />
          <span>Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex-1 min-w-27.5 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "notes"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 min-w-27.5 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "timeline"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Activity Log</span>
        </button>
      </div>

      {/* Tab 1: Overview, Eligibility, Requirements & Benefits */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Description Card */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <h3 className="text-base font-bold font-outfit text-white">Program Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {opportunity.fullDescription || opportunity.shortDescription || "No description provided."}
            </p>
          </div>

          {/* Grid: Eligibility, Requirements & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Eligibility */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Eligibility</span>
              </div>
              {opportunity.eligibility.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-300">
                  {opportunity.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No specific eligibility listed.</p>
              )}
            </div>

            {/* Requirements */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                <ListCheck className="w-4 h-4" />
                <span>Requirements</span>
              </div>
              {opportunity.requirements.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-300">
                  {opportunity.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-indigo-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No specific requirements listed.</p>
              )}
            </div>

            {/* Benefits */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>Financial Benefits</span>
              </div>
              {opportunity.benefits.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-300">
                  {opportunity.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No benefits listed.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Essay Prompts & Drafts */}
      {activeTab === "essays" && (
        <div className="space-y-6">
          {opportunity.essayQuestions.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No Essay Prompts Found</h4>
              <p className="text-xs text-slate-400">
                This opportunity does not have saved essay questions. You can add them via the Edit modal.
              </p>
            </div>
          ) : (
            opportunity.essayQuestions.map((essay, idx) => (
              <div key={essay.id || idx} className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-purple-400">
                      Essay Prompt #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">{essay.question}</h4>
                  </div>
                  {essay.wordLimit && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
                      Limit: {essay.wordLimit} words
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Your Draft Response:</label>
                  <textarea
                    rows={5}
                    value={essayDrafts[essay.id!] || ""}
                    onChange={(e) =>
                      setEssayDrafts((prev) => ({ ...prev, [essay.id!]: e.target.value }))
                    }
                    placeholder="Write or refine your essay response draft here..."
                    className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveEssayDraft(essay.id!)}
                      disabled={savingEssayId === essay.id}
                      className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingEssayId === essay.id ? "Saving..." : "Save Draft"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Interactive Application Checklist */}
      {activeTab === "checklist" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-outfit text-white">Application Checklist</h3>
            <p className="text-xs text-slate-400">
              Track key preparation steps for {opportunity.title}.
            </p>
          </div>

          <div className="space-y-3">
            {defaultChecklistItems.map((item) => {
              const isDone = Boolean(checkedItems[item.key]);
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggleChecklist(item.key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isDone
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-200"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isDone
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs font-medium ${isDone ? "line-through opacity-80" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">
                    {isDone ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Personal Notes Editor */}
      {activeTab === "notes" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-outfit text-white">Personal Vault Notes</h3>
            {notesSuccess && (
              <span className="text-xs text-emerald-400 font-medium">Notes Saved Successfully!</span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Keep private application notes, reviewer contacts, or submission instructions.
          </p>
          <textarea
            rows={8}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type your personal notes here..."
            className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingNotes ? "Saving Notes..." : "Save Personal Notes"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Activity Log Audit Timeline */}
      {activeTab === "timeline" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-outfit text-white">Activity Log Timeline</h3>
            <p className="text-xs text-slate-400">
              Chronological audit trail of all historical updates and modifications.
            </p>
          </div>

          {activityLogs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No activity logs recorded yet for this opportunity.
            </p>
          ) : (
            <div className="relative border-l border-slate-800 ml-3 space-y-6">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative pl-6 space-y-1">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-slate-950" />
                  <div className="text-xs font-semibold text-purple-300">
                    {log.action.replace(/_/g, " ")}
                  </div>
                  <p className="text-xs text-slate-300">{log.description}</p>
                  <div className="text-[10px] text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Opportunity Edit Modal */}
      <OpportunityFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        opportunityToEdit={opportunity}
      />
    </div>
  );
}
