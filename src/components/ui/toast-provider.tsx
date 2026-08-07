"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider />");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Variant Styling Config                                                    */
/* -------------------------------------------------------------------------- */

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; border: string; bg: string; text: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: XCircle,
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    iconColor: "text-rose-400",
  },
  info: {
    icon: Info,
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
    iconColor: "text-sky-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    iconColor: "text-amber-400",
  },
};

/* -------------------------------------------------------------------------- */
/*  Single Toast Component                                                    */
/* -------------------------------------------------------------------------- */

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = VARIANT_CONFIG[item.variant];
  const Icon = config.icon;

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(item.id), 300);
    }, item.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.id, item.duration, onDismiss]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsExiting(true);
    setTimeout(() => onDismiss(item.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl shadow-black/20 transition-all duration-300 ease-out min-w-[320px] max-w-[420px]",
        config.border,
        config.bg,
        isVisible && !isExiting
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", config.iconColor)} aria-hidden="true" />
      <p className={cn("text-sm font-medium flex-1", config.text)}>{item.message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant, duration = 4000) => {
      const id = `toast-${++toastIdCounter}-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const api: ToastContextValue = {
    success: useCallback(
      (msg: string, dur?: number) => addToast(msg, "success", dur),
      [addToast]
    ),
    error: useCallback(
      (msg: string, dur?: number) => addToast(msg, "error", dur),
      [addToast]
    ),
    info: useCallback(
      (msg: string, dur?: number) => addToast(msg, "info", dur),
      [addToast]
    ),
    warning: useCallback(
      (msg: string, dur?: number) => addToast(msg, "warning", dur),
      [addToast]
    ),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Toast Container – fixed top-right */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-auto"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <Toast key={t.id} item={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
