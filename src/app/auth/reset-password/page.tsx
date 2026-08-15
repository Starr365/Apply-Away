"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email") || "";
    const msgParam = searchParams.get("msg") || "";
    if (emailParam && email !== emailParam) {
      setEmail(emailParam);
    }
    if (msgParam && successMsg !== msgParam) {
      setSuccessMsg(msgParam);
    }
  }, [searchParams, email, successMsg]);

  const formSpring = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: { opacity: 0, transform: "translateY(12px)" },
    config: { tension: 280, friction: 22 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: resetCode, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Reset failed. Check your code.");
        toast.error(data.error || "Reset failed.");
      } else {
        toast.success("Password updated successfully.");
        // Redirect to Login Page with success parameter
        router.push("/auth?success=" + encodeURIComponent(data.message || "Password updated successfully. Please login."));
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 shadow-2xl border border-border">
      <div className="space-y-4 text-center">
        <div className="flex flex-col items-center justify-center border-b border-border pb-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-outfit text-foreground text-center">
              Set New Password
            </h2>
            <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
              Enter the verification code sent to your email to update password.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium space-y-1">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium space-y-1">
          <p>{errorMsg}</p>
        </div>
      )}

      <animated.div style={formSpring} className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="code-input" className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>Verification Code</span>
            </label>
            <input
              id="code-input"
              type="text"
              required
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-card border border-input text-center tracking-widest text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="new-password-input" className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>New Password</span>
            </label>
            <div className="relative">
              <input
                id="new-password-input"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Create new password (min. 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 pl-4 pr-12 rounded-xl bg-card border border-input text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full justify-center"
          >
            Update Password
          </Button>

          <Link
            href="/auth"
            className="w-full h-11 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </form>
      </animated.div>

      <div className="flex items-center justify-center space-x-2 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span>Encrypted Opportunity Vault Session</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
