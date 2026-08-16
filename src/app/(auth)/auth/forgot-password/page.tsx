"use client";

import { useState } from "react";
import Link from "next/link";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  ArrowLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formSpring = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: { opacity: 0, transform: "translateY(12px)" },
    config: { tension: 280, friction: 22 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to request code.");
        toast.error(data.error || "Failed to request code.");
      } else {
        toast.success("Verification code sent.");
        // Redirect to Reset Password sub-route with email context
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&msg=${encodeURIComponent(data.message || "Verification code sent to your email.")}`);
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
              Reset Password Code
            </h2>
            <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
              Enter your email to request a 6-digit verification pin.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium space-y-1">
          <p>{errorMsg}</p>
        </div>
      )}

      <animated.div style={formSpring} className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email-input" className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
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
              className="w-full h-11 px-4 rounded-xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full justify-center"
          >
            Send Verification PIN
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
