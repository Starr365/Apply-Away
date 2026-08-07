import { Sparkles, Calendar, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Apply Away
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Architecture v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Personal Opportunity Vault</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-outfit tracking-tight text-white leading-tight">
            Never Miss Another <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Deadline</span> or Opportunity.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Extract, organize, and manage fellowships, scholarships, grants, and career applications in one centralized, intelligent vault.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
          <div className="glass-card p-6 rounded-2xl transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-white mb-2">Smart AI Capture</h3>
            <p className="text-sm text-slate-400">
              Paste website URLs or raw text messages. AI automatically extracts dates, eligibility, and essay questions into structured data.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-white mb-2">Timezone Deadlines</h3>
            <p className="text-sm text-slate-400">
              Timezone-aware reminder system ensuring email notifications reach you accurately in your local timezone.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-white mb-2">Clean Architecture</h3>
            <p className="text-sm text-slate-400">
              Built with Next.js 15 App Router, React 19, strict TypeScript, Prisma ORM, and SOLID engineering principles.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()} – Built for all by Starr365.
        </div>
      </footer>
    </div>
  );
}
