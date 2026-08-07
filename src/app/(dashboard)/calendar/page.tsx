import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { CalendarView } from "@/components/modules/calendar/calendar-view";
import Link from "next/link";
import { Sparkles, ArrowLeft, User } from "lucide-react";

const repository = new PrismaOpportunityRepository();

export default async function CalendarPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null; // Handled by middleware
  }

  // Fetch opportunities with deadlines for this user
  const { items: opportunities } = await repository.findAll({
    userId,
    limit: 100, // Fetch up to 100 opportunities for calendar view
    sortBy: "deadline",
    sortOrder: "asc",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
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
              href="/dashboard"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
              <span>Vault Dashboard</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>{session.user.name || "Profile"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
            Application Deadline Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual month overview of all upcoming application deadlines and key dates.
          </p>
        </div>

        <CalendarView opportunities={opportunities} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Apply Away &copy; {new Date().getFullYear()} – Deadline Calendar
        </div>
      </footer>
    </div>
  );
}
