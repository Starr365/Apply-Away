"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Sparkles, ArrowRight, ShieldCheck, Mail, User as UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

export default function LoginPage() {
  const toast = useToast();
  const [email, setEmail] = useState("user@applyaway.app");
  const [name, setName] = useState("Apply Away User");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email,
        name,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Sign-in failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.info("Google Sign-In is coming soon for this MVP stage!");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-500 items-center justify-center shadow-xl shadow-purple-500/20 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold font-outfit tracking-tight text-white">
            Welcome to Apply Away
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to access your personal AI-powered opportunity vault.
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center space-x-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-xs text-slate-500 uppercase font-medium absolute">
              Or sign in with email
            </span>
          </div>

          {/* Simplified Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apply Away User"
                className="w-full h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@applyaway.app"
                className="w-full h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Signing In..." : "Enter Vault"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-Tenant Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
