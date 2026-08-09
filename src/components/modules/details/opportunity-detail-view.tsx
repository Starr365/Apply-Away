"use client";

import { useState } from "react";
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
import { useToast } from "@/components/ui/toast-provider";

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  activityLogs: ActivityLog[];
}

export function OpportunityDetailView({
  opportunity,
  activityLogs,
}: OpportunityDetailViewProps) {
  const toast = useToast();
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
          className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault Dashboard</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Opportunity</span>
        </button>
      </div>

      {/* Main Opportunity Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-primary font-semibold">
              <Building className="w-4 h-4" />
              <span>{opportunity.organization}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground">
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
        <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-foreground">
            <Clock
              className={`w-4 h-4 ${
                deadlineInfo.isOverdue ? "text-destructive" : "text-amber-500"
              }`}
            />
            <span className="font-medium">
              Deadline:{" "}
              <strong className={deadlineInfo.isOverdue ? "text-destructive" : "text-foreground"}>
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
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-secondary border border-border text-primary hover:text-primary/80 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>Official Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all"
              >
                <span>Apply Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Detail Tab Navigation Bar */}
      <div className="flex rounded-2xl bg-secondary p-1.5 border border-border overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-1 min-w-27.5 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
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
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
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
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
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
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
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
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
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
            <h3 className="text-base font-bold font-outfit text-foreground">Program Overview</h3>
            <p className="text-sm text-foreground leading-relaxed">
              {opportunity.fullDescription || opportunity.shortDescription || "No description provided."}
            </p>
          </div>

          {/* Grid: Eligibility, Requirements & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Eligibility */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Eligibility</span>
              </div>
              {opportunity.eligibility.length > 0 ? (
                <ul className="space-y-2 text-xs text-foreground">
                  {opportunity.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No specific eligibility listed.</p>
              )}
            </div>

            {/* Requirements */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                <ListCheck className="w-4 h-4" />
                <span>Requirements</span>
              </div>
              {opportunity.requirements.length > 0 ? (
                <ul className="space-y-2 text-xs text-foreground">
                  {opportunity.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No specific requirements listed.</p>
              )}
            </div>

            {/* Benefits */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>Financial Benefits</span>
              </div>
              {opportunity.benefits.length > 0 ? (
                <ul className="space-y-2 text-xs text-foreground">
                  {opportunity.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No benefits listed.</p>
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
              <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
              <h4 className="text-base font-bold text-foreground">No Essay Prompts Found</h4>
              <p className="text-xs text-muted-foreground">
                This opportunity does not have saved essay questions. You can add them via the Edit modal.
              </p>
            </div>
          ) : (
            opportunity.essayQuestions.map((essay, idx) => (
              <div key={essay.id || idx} className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary">
                      Essay Prompt #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-foreground leading-snug">{essay.question}</h4>
                  </div>
                  {essay.wordLimit && (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border text-xs font-medium">
                      Limit: {essay.wordLimit} words
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Your Draft Response:</label>
                  <textarea
                    rows={5}
                    value={essayDrafts[essay.id!] || ""}
                    onChange={(e) =>
                      setEssayDrafts((prev) => ({ ...prev, [essay.id!]: e.target.value }))
                    }
                    placeholder="Write or refine your essay response draft here..."
                    className="w-full p-4 rounded-2xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveEssayDraft(essay.id!)}
                      disabled={savingEssayId === essay.id}
                      className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
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
            <h3 className="text-lg font-bold font-outfit text-foreground">Application Checklist</h3>
            <p className="text-xs text-muted-foreground">
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
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isDone
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs font-medium ${isDone ? "line-through opacity-85" : ""}`}>
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
            <h3 className="text-lg font-bold font-outfit text-foreground">Personal Vault Notes</h3>
            {notesSuccess && (
              <span className="text-xs text-primary font-medium">Notes Saved Successfully!</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Keep private application notes, reviewer contacts, or submission instructions.
          </p>
          <textarea
            rows={8}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type your personal notes here..."
            className="w-full p-4 rounded-2xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
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
            <h3 className="text-lg font-bold font-outfit text-foreground">Activity Log Timeline</h3>
            <p className="text-xs text-muted-foreground">
              Chronological audit trail of all historical updates and modifications.
            </p>
          </div>

          {activityLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No activity logs recorded yet for this opportunity.
            </p>
          ) : (
            <div className="relative border-l border-border ml-3 space-y-6">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative pl-6 space-y-1">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <div className="text-xs font-semibold text-primary">
                    {log.action.replace(/_/g, " ")}
                  </div>
                  <p className="text-xs text-foreground">{log.description}</p>
                  <div className="text-[10px] text-slate-500 dark:text-slate-405">
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
