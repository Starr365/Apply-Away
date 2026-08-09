"use client";

import { useState } from "react";
import {
  Opportunity,
  OpportunityCategory,
  OpportunityStatus,
  OpportunityPriority,
} from "@/domain/opportunity.types";
import {
  createOpportunityAction,
  updateOpportunityAction,
} from "@/app/actions/opportunity.actions";
import { X, Sparkles, Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityToEdit?: Opportunity | null;
}

export function OpportunityFormModal({
  isOpen,
  onClose,
  opportunityToEdit,
}: OpportunityFormModalProps) {
  if (!isOpen) return null;

  return (
    <OpportunityFormContent
      key={opportunityToEdit?.id || "new"}
      onClose={onClose}
      opportunityToEdit={opportunityToEdit}
    />
  );
}

function OpportunityFormContent({
  onClose,
  opportunityToEdit,
}: {
  onClose: () => void;
  opportunityToEdit?: Opportunity | null;
}) {
  const toast = useToast();
  const isEditing = Boolean(opportunityToEdit);

  const [title, setTitle] = useState(opportunityToEdit?.title || "");
  const [organization, setOrganization] = useState(opportunityToEdit?.organization || "");
  const [category, setCategory] = useState<OpportunityCategory>(
    opportunityToEdit?.category || "FELLOWSHIP"
  );
  const [shortDescription, setShortDescription] = useState(
    opportunityToEdit?.shortDescription || ""
  );
  const [officialUrl, setOfficialUrl] = useState(opportunityToEdit?.officialUrl || "");
  const [applicationUrl, setApplicationUrl] = useState(opportunityToEdit?.applicationUrl || "");
  const [deadline, setDeadline] = useState(
    opportunityToEdit?.deadline
      ? new Date(opportunityToEdit.deadline).toISOString().split("T")[0]
      : ""
  );
  const [status, setStatus] = useState<OpportunityStatus>(
    opportunityToEdit?.status || "NOT_STARTED"
  );
  const [priority, setPriority] = useState<OpportunityPriority>(
    opportunityToEdit?.priority || "MEDIUM"
  );
  const [personalNotes, setPersonalNotes] = useState(opportunityToEdit?.personalNotes || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      title,
      organization,
      category,
      shortDescription,
      officialUrl: officialUrl.trim() !== "" ? officialUrl : "",
      applicationUrl: applicationUrl.trim() !== "" ? applicationUrl : "",
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status,
      priority,
      personalNotes,
    };

    try {
      const res = isEditing && opportunityToEdit
        ? await updateOpportunityAction(opportunityToEdit.id, payload)
        : await createOpportunityAction(payload);

      if (res.success) {
        toast.success(
          isEditing ? "Opportunity updated successfully!" : "Opportunity created successfully!"
        );
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to save opportunity.");
        toast.error(res.error || "Failed to save opportunity.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-outfit text-foreground">
                {isEditing ? "Edit Opportunity" : "Create New Opportunity"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? "Update opportunity details in your vault."
                  : "Add a new opportunity manually to your centralized vault."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-card-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-foreground">Opportunity Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandela Washington Fellowship 2027"
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Organization / Host *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. U.S. Department of State"
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
              >
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
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OpportunityStatus)}
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="INTERVIEW">Interview</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OpportunityPriority)}
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Official Website URL */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Official Website URL</label>
              <input
                type="url"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Direct Application Portal Link */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Direct Application Portal Link</label>
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://apply..."
                className="w-full h-11 px-4 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-foreground">Short Description</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary of requirements, benefits, or goals..."
                className="w-full p-3 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
              />
            </div>

            {/* Personal Notes */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-foreground">Personal Notes</label>
              <textarea
                rows={2}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Private application notes, reminders, or contact details..."
                className="w-full p-3 rounded-xl bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-border pt-4 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={isEditing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {isEditing ? "Save Changes" : "Create Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
