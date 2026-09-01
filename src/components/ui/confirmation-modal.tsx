"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "./button";
import { useMounted } from "@/lib/use-mounted";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const isMounted = useMounted();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !isMounted) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <Trash2 className="w-6 h-6 text-red-400" />,
          iconBg: "bg-red-500/10 border-red-500/20 text-red-400",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          confirmButton: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20",
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-accent-primary" />,
          iconBg: "bg-accent-primary/10 border-accent-primary/20 text-accent-primary",
          confirmButton: "bg-accent-primary hover:bg-accent-primary/90 text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return createPortal(
    <div className="fixed inset-0 z-9999 w-screen h-screen flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 glass-panel w-full max-w-md rounded-3xl p-6 space-y-6 border border-border shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-2xl border ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <div>
              <h3
                id="confirmation-modal-title"
                className="text-lg font-bold font-outfit text-foreground leading-tight"
              >
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2 text-sm cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition-all cursor-pointer ${styles.confirmButton}`}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
