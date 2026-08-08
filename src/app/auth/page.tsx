"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

function AuthContent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect immediately
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          router.replace(callbackUrl);
        }
      })
      .catch(() => {});
  }, [router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "signup") {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }
        // Call signup API first
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, password }),
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) {
          toast.error(signupData.error || "Sign-up failed.");
          setIsLoading(false);
          return;
        }
      }

      const res = await signIn("credentials", {
        email,
        name: mode === "signup" ? name : undefined,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Access granted! Entering vault…");
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error during sign‑in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    toast.info("Google Sign‑In coming soon for MVP stage.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Image
              src="/text-vault.png"
              alt="Apply Away Logo"
              width={180}
              height={48}
              priority
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold font-outfit tracking-tight text-white">Welcome to Apply Away</h1>
          <p className="text-sm text-slate-400">{mode === "signin" ? "Sign in to access your personal AI‑powered opportunity vault." : "Create an account to start storing your opportunities."}</p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center space-x-4 mb-4" role="tablist" aria-label="Authentication Options">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => {
              setMode("signin");
              setShowPassword(false);
            }}
            className={`px-4 py-2 rounded-t-xl font-semibold text-sm transition-colors cursor-pointer ${mode === "signin" ? "bg-slate-800 text-white border-b-2 border-purple-500" : "bg-slate-700/50 text-slate-400 hover:text-slate-300"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => {
              setMode("signup");
              setShowPassword(false);
            }}
            className={`px-4 py-2 rounded-t-xl font-semibold text-sm transition-colors cursor-pointer ${mode === "signup" ? "bg-slate-800 text-white border-b-2 border-purple-500" : "bg-slate-700/50 text-slate-400 hover:text-slate-300"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
          {/* Google OAuth Placeholder */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center space-x-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-xs text-slate-500 uppercase font-medium absolute">Or {mode === "signin" ? "sign in" : "sign up"} with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="name-input" className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Full Name</span>
                </label>
                <input
                  id="name-input"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apply Away User"
                  className="w-full h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Email Address</span>
              </label>
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@applyaway.app"
                className="w-full h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signin" ? "Your password" : "Create a password (min. 6 characters)"}
                  className="w-full h-11 pl-4 pr-11 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{mode === "signin" ? "Signing In…" : "Signing Up…"}</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "Enter Vault" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi‑Tenant Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
