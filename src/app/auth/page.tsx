"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

function AuthContent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Forgotten password code / reset inputs
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Animated entrance using react-spring
  const formSpring = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: { opacity: 0, transform: "translateY(12px)" },
    config: { tension: 280, friction: 22 },
  });

  useEffect(() => {
    // If already authenticated, redirect immediately
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          router.replace(callbackUrl);
        }
      })
      .catch(() => { });
  }, [router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (mode === "signup") {
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          toast.error("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }

        // Call signup API
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            password,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        });
        const signupData = await signupRes.json();

        if (!signupRes.ok) {
          setErrorMsg(signupData.error || "Sign-up failed. Please try again.");
          toast.error(signupData.error || "Sign-up failed.");
          setIsLoading(false);
          return;
        }

        const msg = signupData.message || "Account created successfully! Please sign in below.";
        setSuccessMsg(msg);
        toast.success("Account created successfully! Please sign in.");
        setMode("signin");
        setPassword("");
        setIsLoading(false);
        return;
      }

      if (mode === "signin") {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          const friendlyErr = "No account found with this email or invalid password.";
          setErrorMsg(friendlyErr);
          toast.error(friendlyErr);
        } else {
          toast.success("Access granted! Entering vault…");
          window.location.href = callbackUrl;
        }
        setIsLoading(false);
        return;
      }

      if (mode === "forgot") {
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
          setSuccessMsg(data.message || "Verification code sent to your email.");
          toast.success("Verification code sent.");
          setMode("reset");
        }
        setIsLoading(false);
        return;
      }

      if (mode === "reset") {
        if (newPassword.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          toast.error("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }

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
          setSuccessMsg(data.message || "Password updated. Please login.");
          toast.success("Password updated successfully.");
          setMode("signin");
          setPassword("");
          setResetCode("");
          setNewPassword("");
        }
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Google sign-in is coming soon.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-7xl px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Opportunity Platform</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-center lg:justify-start">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                <Image
                  src="/text-vault.png"
                  alt="Apply Away Logo"
                  width={280}
                  height={72}
                  priority
                  className="h-16 sm:h-20 w-auto max-w-full object-contain dark:invert shrink-0 cursor-pointer"
                />
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit tracking-tight text-foreground leading-tight">
              Manage all opportunities from one central vault.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Save opportunities from URLs or copied text, automatically extract structured data with AI, track deadlines, and reflect on your application journey.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs font-medium text-muted-foreground hidden sm:block">
            <div className="flex items-center space-x-2.5 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Instant AI Structured Data Extraction</span>
            </div>
            <div className="flex items-center space-x-2.5 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Timezone-Localized Deadline Email Reminders</span>
            </div>
            <div className="flex items-center space-x-2.5 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Interactive Application Journey & Analytics</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 shadow-2xl border border-border">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="flex flex-col items-center justify-center border-b border-border pb-5 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-outfit text-foreground text-center">
                    {mode === "signin" && "Sign In to Vault"}
                    {mode === "signup" && "Create Account"}
                    {mode === "forgot" && "Reset Password Code"}
                    {mode === "reset" && "Set New Password"}
                  </h2>
                  <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
                    {mode === "signin" && "Enter your credentials to access your saved opportunities."}
                    {mode === "signup" && "Register to get a welcome email and start storing opportunities."}
                    {mode === "forgot" && "Enter your email to request a 6-digit verification pin."}
                    {mode === "reset" && "Enter the verification code sent to your email to update password."}
                  </p>
                </div>

                {/* Tab Selector Pill */}
                {(mode === "signin" || mode === "signup") && (
                  <div className="flex justify-center mx-auto rounded-2xl bg-secondary/80 p-1.5 border border-border/80 relative shadow-inner shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className={`relative z-10 px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer \${
                        mode === "signin"
                          ? "bg-primary text-slate-950 shadow-md shadow-primary/30 scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className={`relative z-10 px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer \${
                        mode === "signup"
                          ? "bg-primary text-slate-950 shadow-md shadow-primary/30 scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Banners */}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium space-y-1 animate-in fade-in-50 duration-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold">{successMsg}</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium space-y-1 animate-in fade-in-50 duration-300">
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Form Body */}
            <animated.div style={formSpring} className="space-y-6">
              {(mode === "signin" || mode === "signup") && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleGoogle}
                    disabled={isLoading}
                    aria-label="Continue with Google Account (coming soon)"
                    className="w-full justify-center space-x-3 bg-card border-border hover:bg-secondary"
                    leftIcon={
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                    }
                  >
                    Continue with Google Account
                  </Button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-border w-full" />
                    <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold absolute">
                      Or {mode === "signin" ? "sign in" : "sign up"} with email
                    </span>
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label htmlFor="name-input" className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-primary" />
                      <span>Full Name</span>
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full h-11 px-4 rounded-xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                    />
                  </div>
                )}

                {(mode === "signin" || mode === "signup" || mode === "forgot") && (
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
                )}

                {mode === "signin" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password-input" className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span>Password</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="text-[10px] text-primary hover:underline font-bold focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full h-11 pl-4 pr-12 rounded-xl bg-card border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "reset" && (
                  <>
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
                  </>
                )}

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  {mode === "signin" && "Enter Vault"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Verification PIN"}
                  {mode === "reset" && "Update Password"}
                </Button>

                {(mode === "forgot" || mode === "reset") && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="w-full h-11 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>
                )}
              </form>
            </animated.div>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Encrypted Opportunity Vault Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
