"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { updateUserTimezone } from "@/app/actions/user.actions";
import { useToast } from "@/components/ui/toast-provider";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { COMMON_TIMEZONES } from "@/lib/constants";
import { Globe, Shield, LogOut, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const toast = useToast();
  const [selectedTimezone, setSelectedTimezone] = useState(
    session?.user?.timezone || "Africa/Lagos"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleTimezoneSave = async () => {
    setIsSaving(true);
    try {
      await updateUserTimezone(selectedTimezone);
      await update({ user: { ...session?.user, timezone: selectedTimezone } });
      toast.success("Timezone updated successfully!");
    } catch (err) {
      console.error("Failed to update timezone:", err);
      toast.error("Failed to update timezone. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400" role="status">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Topbar */}
        <AnimatedContainer delay={0} direction="fade">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-purple-300">Account Settings</span>
            </div>
          </div>
        </AnimatedContainer>

        {/* Profile Card */}
        <AnimatedContainer delay={100}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div
                className="w-20 h-20 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-purple-500/20"
                aria-hidden="true"
              >
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-2xl font-bold font-outfit text-white">
                  {session.user.name || "User Profile"}
                </h2>
                <p className="text-sm text-slate-400">{session.user.email}</p>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium mt-2">
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Multi-Tenant Encrypted Profile</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-6 space-y-6">
              {/* Timezone Settings Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="timezone-select"
                    className="text-sm font-semibold text-white flex items-center space-x-2"
                  >
                    <Globe className="w-4 h-4 text-purple-400" aria-hidden="true" />
                    <span>Notification Timezone</span>
                  </label>
                </div>
                <p className="text-xs text-slate-400">
                  Deadline reminders will be dispatched according to your selected local timezone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    id="timezone-select"
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    aria-label="Select your timezone"
                  >
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleTimezoneSave}
                    disabled={isSaving}
                    className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
                    aria-label={isSaving ? "Saving timezone" : "Save timezone"}
                  >
                    {isSaving ? "Saving..." : "Save Timezone"}
                  </button>
                </div>
              </div>

              {/* Account Management */}
              <div className="border-t border-slate-800/80 pt-6 flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-slate-200">Sign Out</div>
                  <div className="text-xs text-slate-400">Safely log out of your current session.</div>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="h-10 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
