import { auth } from "@/lib/auth";
import Link from "next/link";
import { Sparkles, User, Plus, FolderOpen } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Dashboard Header Navbar */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight text-white">
              Apply Away
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>{session?.user?.name || "Profile"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
              Welcome back, {session?.user?.name || "Applicant"}!
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Centralized Opportunity Vault • Timezone:{" "}
              <span className="text-purple-300 font-medium">
                {session?.user?.timezone || "Africa/Lagos"}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="h-11 px-5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </button>
        </div>

        {/* Empty Opportunity Vault Skeleton State */}
        <div className="glass-panel rounded-3xl p-12 text-center space-y-5 my-12">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold font-outfit text-white">Your Vault is Empty</h3>
            <p className="text-sm text-slate-400">
              No saved opportunities yet. Paste a website URL or text message to extract and track your first opportunity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()} – Multi-Tenant Authenticated Vault
        </div>
      </footer>
    </div>
  );
}
