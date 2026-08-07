"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4"
          role="alert"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-lg font-bold font-outfit text-white">
              {this.props.fallbackTitle || "Something went wrong"}
            </h3>
            <p className="text-sm text-slate-400">
              {this.props.fallbackDescription ||
                "An unexpected error occurred. Please try again or contact support if the issue persists."}
            </p>
            {this.state.error && (
              <p className="text-xs text-slate-500 font-mono mt-2 wrap-break-word">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
