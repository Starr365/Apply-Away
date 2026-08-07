"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="text-lg font-bold text-white">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-400">
              An unexpected error occurred. Please try again or contact support.
            </p>
            {error?.digest && (
              <p className="text-xs text-slate-500 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </body>
    </html>
  );
}
