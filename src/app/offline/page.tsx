import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-outfit font-bold text-xl tracking-tight text-white">
              Apply Away
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center flex-1 flex flex-col justify-center items-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
          <WifiOff className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-white">You are offline</h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            It looks like you don't have an active internet connection. Previously cached pages and dashboard metrics may still be available.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
        >
          <span>Go to Dashboard</span>
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60 text-center text-xs text-slate-500">
        Apply Away &copy; {new Date().getFullYear()} – Offline Mode
      </footer>
    </div>
  );
}
