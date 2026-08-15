"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
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

      toast.success("Account created successfully! Please sign in.");
      // Redirect to sign in page
      router.push("/auth?success=" + encodeURIComponent(signupData.message || "Account created successfully! Please sign in."));
    } catch {
      setErrorMsg("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Google sign-in is coming soon.");
  };

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 shadow-2xl border border-border">
      <div className="space-y-4 text-center">
        <div className="flex flex-col items-center justify-center border-b border-border pb-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-outfit text-foreground text-center">
              Create Account
            </h2>
            <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
              Register to get a welcome email and start storing opportunities.
            </p>
          </div>

          {/* Tab Selector Pill */}
          <div className="flex justify-center mx-auto rounded-2xl bg-secondary/80 p-1.5 border border-border/80 relative shadow-inner shrink-0">
            <Link
              href="/auth"
              className="relative z-10 px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="relative z-10 px-6 py-2 rounded-xl text-xs font-extrabold bg-primary text-slate-950 shadow-md shadow-primary/30 scale-[1.02] cursor-pointer"
            >
              Sign Up
            </button>
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
            Or sign up with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-1.5">
            <label htmlFor="password-input" className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 characters)"
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center"
          >
            Create Account
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
