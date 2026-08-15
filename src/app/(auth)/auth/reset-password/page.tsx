"use client";

import { useState, Suspense, useRef } from "react";
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
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(() => searchParams.get("msg") || "");

  // 6 separate OTP input box values
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formSpring = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: { opacity: 0, transform: "translateY(12px)" },
    config: { tension: 280, friction: 22 },
  });

  const handleOtpChange = (value: string, index: number) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input box if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Focus previous input box on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    // Focus the last input box
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const assembledCode = otp.join("");
    if (assembledCode.length !== 6) {
      setErrorMsg("Please enter all 6 verification digits.");
      toast.error("Please enter all 6 verification digits.");
      setIsLoading(false);
      return;
    }

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
        body: JSON.stringify({ email, code: assembledCode, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Reset failed. Check your code.");
        toast.error(data.error || "Reset failed.");
      } else {
        toast.success("Password updated successfully.");
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Box Inputs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center space-x-1.5 justify-center sm:justify-start">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>6-Digit Verification PIN</span>
            </label>
            <div className="flex justify-between gap-2 max-w-xs mx-auto sm:mx-0">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-11 h-12 bg-card border border-input rounded-xl text-center font-extrabold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
                />
              ))}
            </div>
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
