"use client";

import { useState } from "react";
import { extractOpportunityAction } from "@/app/actions/ai-extraction.actions";
import { createOpportunityAction } from "@/app/actions/opportunity.actions";
import { ExtractedOpportunityData } from "@/services/interfaces/ai-extraction.service";
import {
  Sparkles,
  X,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building,
  Calendar,
} from "lucide-react";
import { OpportunityCategory } from "@/domain/opportunity.types";

interface AICaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AICaptureModal({ isOpen, onClose, onSuccess }: AICaptureModalProps) {
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-outfit text-white">AI Opportunity Capture</h2>
              <p className="text-xs text-slate-400">
                Paste a website link or text message to extract structured data automatically.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Input Form (when not previewing) */}
        {!extractedData && (
          <div className="space-y-5">
            {/* Input Method Tabs */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "url"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Website URL</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "text"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Copied Message / Text</span>
              </button>
            </div>

            <form onSubmit={handleExtract} className="space-y-4">
              {activeTab === "url" ? (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Opportunity Website URL</label>
                  <input
                    type="url"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.mandelawashingtonfellowship.org/apply..."
                    className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">
                    Paste WhatsApp, LinkedIn, or Email Content
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste full opportunity text message here..."
                    className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isExtracting}
                className="w-full h-12 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Extracting Structured Opportunity...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract with AI</span>
                  </>
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
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start space-x-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Potential Duplicate Detected ({duplicateType})</span>
                  <p className="text-slate-400">
                    A matching opportunity already exists in your vault. Saving will add this record alongside your existing entry.
                  </p>
                </div>
              </div>
            )}

            {/* Structured Card Preview */}
            <div className="glass-card p-5 rounded-2xl space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-purple-400 font-semibold">
                    <Building className="w-3.5 h-3.5" />
                    <span>{extractedData.organization}</span>
                  </div>
                  <h3 className="text-base font-bold font-outfit text-white">
                    {extractedData.title}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                  {extractedData.category}
                </span>
              </div>

              {extractedData.shortDescription && (
                <p className="text-slate-300 leading-relaxed">{extractedData.shortDescription}</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Deadline:{" "}
                    <strong className="text-white">
                      {extractedData.deadline
                        ? new Date(extractedData.deadline).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Prompts: <strong className="text-white">{extractedData.essayQuestions.length}</strong>
                  </span>
                </div>
              </div>

              {extractedData.essayQuestions.length > 0 && (
                <div className="border-t border-slate-800/80 pt-3 space-y-1">
                  <span className="font-semibold text-slate-300">Extracted Prompts:</span>
                  <ul className="list-disc list-inside text-slate-400 space-y-0.5">
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
            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetModal}
                className="h-11 px-4 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Input
              </button>

              <button
                type="button"
                onClick={handleSaveToVault}
                disabled={isSaving}
                className="h-11 px-6 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
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
