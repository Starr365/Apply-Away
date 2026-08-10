"use client";

import { useState, useEffect } from "react";
import { extractOpportunityAction } from "@/app/actions/ai-extraction.actions";
import { createOpportunityAction } from "@/app/actions/opportunity.actions";
import { ExtractedOpportunityData } from "@/services/interfaces/ai-extraction.service";
import {
  X,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building,
  Calendar,
  PenLine,
  ShieldAlert,
} from "lucide-react";
import { OpportunityCategory } from "@/domain/opportunity.types";

interface AICaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFallbackManual?: () => void;
}

export function AICaptureModal({ isOpen, onClose, onSuccess, onFallbackManual }: AICaptureModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isQuotaError, setIsQuotaError] = useState(false);

  // Extracted Data Preview State
  const [extractedData, setExtractedData] = useState<ExtractedOpportunityData | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateType, setDuplicateType] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExtracting(true);
    setErrorMsg("");
    setIsQuotaError(false);
    setExtractedData(null);
    setIsDuplicate(false);

    try {
      const res = await extractOpportunityAction({
        url: activeTab === "url" ? urlInput : undefined,
        text: activeTab === "text" ? textInput : undefined,
      });

      if (res.success && res.data) {
        setExtractedData(res.data);
        if (res.isDuplicate) {
          setIsDuplicate(true);
          setDuplicateType(res.duplicateMatchType || "MATCH");
        }
      } else {
        setErrorMsg(res.error || "Failed to extract opportunity data.");
        if (res.isQuotaError) {
          setIsQuotaError(true);
        }
      }
    } catch {
      setErrorMsg("An unexpected error occurred during AI extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!extractedData) return;
    setIsSaving(true);
    setErrorMsg("");

    try {
      const res = await createOpportunityAction({
        title: extractedData.title,
        organization: extractedData.organization,
        category: extractedData.category as OpportunityCategory,
        shortDescription: extractedData.shortDescription,
        fullDescription: extractedData.fullDescription,
        eligibility: extractedData.eligibility,
        requirements: extractedData.requirements,
        benefits: extractedData.benefits,
        applicationUrl: extractedData.applicationUrl,
        officialUrl: extractedData.officialUrl,
        deadline: extractedData.deadline ? new Date(extractedData.deadline).toISOString() : null,
        startDate: extractedData.startDate ? new Date(extractedData.startDate).toISOString() : null,
        originalTimezone: extractedData.originalTimezone || "Africa/Lagos",
        essayQuestions: extractedData.essayQuestions.map((q) => ({ question: q })),
        status: "NOT_STARTED",
        priority: "MEDIUM",
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to save extracted opportunity.");
      }
    } catch {
      setErrorMsg("An error occurred while saving to your vault.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetModal = () => {
    setExtractedData(null);
    setIsDuplicate(false);
    setIsQuotaError(false);
    setErrorMsg("");
  };

  const handleContinueManually = () => {
    onClose();
    onFallbackManual?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold font-outfit text-foreground">AI Opportunity Capture</h2>
            <p className="text-xs text-muted-foreground">
              Paste a website link or text message to extract structured data automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quota / Rate Limit Error Banner */}
        {isQuotaError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">AI Usage Limit Reached</p>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                  AI extraction is temporarily unavailable. You&apos;ve reached the current AI usage limit.
                  You can still add this opportunity manually, or try again later.
                </p>
              </div>
            </div>
            {onFallbackManual && (
              <button
                type="button"
                onClick={handleContinueManually}
                className="w-full h-11 rounded-xl bg-secondary border border-border hover:bg-secondary/80 text-xs font-semibold text-foreground flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <PenLine className="w-4 h-4 text-primary" />
                <span>Continue manually</span>
              </button>
            )}
          </div>
        )}

        {/* General Error (non-quota) */}
        {errorMsg && !isQuotaError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Input Form (when not previewing) */}
        {!extractedData && !isQuotaError && (
          <div className="space-y-5">
            {/* Input Method Tabs */}
            <div className="flex rounded-xl bg-secondary/80 p-1.5 border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${activeTab === "url"
                    ? "bg-primary text-slate-950 shadow-md shadow-primary/30 scale-[1.01]"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Website URL</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${activeTab === "text"
                    ? "bg-primary text-slate-950 shadow-md shadow-primary/30 scale-[1.01]"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Copied Message / Text</span>
              </button>
            </div>

            <form onSubmit={handleExtract} className="space-y-4">
              {activeTab === "url" ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Opportunity Website URL</label>
                  <input
                    type="url"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.mandelawashingtonfellowship.org/apply..."
                    className="w-full h-12 px-4 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Paste WhatsApp, LinkedIn, or Email Content
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste full opportunity text message here..."
                    className="w-full p-4 rounded-xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isExtracting}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              >
                {isExtracting ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Extracting Structured Opportunity...</span>
                  </div>
                ) : (
                  <span>Extract with AI</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Extracted Data Preview & Duplicate Alert */}
        {extractedData && (
          <div className="space-y-6">
            {/* Duplicate Warning */}
            {isDuplicate && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-start space-x-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Potential Duplicate Detected ({duplicateType})</span>
                  <p className="text-slate-550 dark:text-slate-400">
                    A matching opportunity already exists in your vault. Saving will add this record alongside your existing entry.
                  </p>
                </div>
              </div>
            )}

            {/* Structured Card Preview */}
            <div className="glass-card p-5 rounded-2xl space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-primary font-semibold">
                    <Building className="w-3.5 h-3.5" />
                    <span>{extractedData.organization}</span>
                  </div>
                  <h3 className="text-base font-bold font-outfit text-foreground">
                    {extractedData.title}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                  {extractedData.category}
                </span>
              </div>

              {extractedData.shortDescription && (
                <p className="text-foreground leading-relaxed">{extractedData.shortDescription}</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 text-muted-foreground">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Deadline:{" "}
                    <strong className="text-foreground">
                      {extractedData.deadline
                        ? new Date(extractedData.deadline).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>
                    Prompts: <strong className="text-foreground">{extractedData.essayQuestions.length}</strong>
                  </span>
                </div>
              </div>

              {extractedData.essayQuestions.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1">
                  <span className="font-semibold text-foreground">Extracted Prompts:</span>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                    {extractedData.essayQuestions.map((q, idx) => (
                      <li key={idx} className="line-clamp-1">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-border pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetModal}
                className="h-11 px-4 rounded-xl bg-secondary border border-border text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Back to Input
              </button>

              <button
                type="button"
                onClick={handleSaveToVault}
                disabled={isSaving}
                className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Vault...</span>
                  </>
                ) : (
                  <>
                    <span>Save to Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

