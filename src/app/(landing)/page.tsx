"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Wand2,
  BarChart3,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  X,
  ExternalLink,
  ChevronDown,
  Lock,
  Plus,
  Play,
} from "lucide-react";

// Pre-defined static lists to keep code clean and readable
const TRUST_LOGOS = ["Cisco", "Adobe", "Slack", "Google", "Spotify"];

const STEPS = [
  {
    num: "01",
    title: "Capture Instantly",
    desc: "Paste an application link or dump raw fellowship guidelines. No forms required.",
    visual: "LINK_CAPTURE",
  },
  {
    num: "02",
    title: "AI Extraction",
    desc: "Our model parses the title, sponsor, official portals, criteria, and deadline parameters in seconds.",
    visual: "AI_PARSER",
  },
  {
    num: "03",
    title: "Automated Tracking",
    desc: "We trigger calendar timelines and email notification cron alerts matching your timezone.",
    visual: "TIMELINE_CRON",
  },
];

const COMPONENT_FEATURES = [
  {
    title: "AI Capture Portal",
    desc: "Instantly translate messy PDF guidelines or webpage portals into structured pipeline records.",
    icon: Wand2,
    badge: "OpenAI v4",
  },
  {
    title: "Timezone-Aware Cron",
    desc: "Configures automatic dispatch windows (14d, 7d, 3d, 1d) matching your customized active profile timezone.",
    icon: Clock,
    badge: "node-cron",
  },
  {
    title: "Interactive Calendar",
    desc: "Full visual deadline timeline overview mapped out across standard month configurations.",
    icon: CalendarIcon,
    badge: "FullCalendar",
  },
  {
    title: "Analytics Conversion",
    desc: "Keep records of your submission rates, velocity curves, and top category counts dynamically.",
    icon: BarChart3,
    badge: "Recharts",
  },
];

const COMPARE_ITEMS = [
  {
    label: "Automatic Deadline Warnings",
    without: "Manual spreadsheet updates (missed deadlines)",
    with: "Automated timezone cron triggers & email dispatch",
  },
  {
    label: "Opportunity Capture Speed",
    without: "5-10 minutes manual form typing per record",
    with: "Instant AI extraction from URLs / text in 3 seconds",
  },
  {
    label: "Organization & Search",
    without: "Disorganized tabs, lost guidelines, dead URL portals",
    with: "Categorized, searchable, structured vault dashboard",
  },
];

const FAQS = [
  {
    q: "Is this a career search platform?",
    a: "No. Apply Away is a private, personal opportunity vault. You collect and track the fellowships, jobs, or grants you care about. We provide the AI organization, calendar layout, and reminder automation.",
  },
  {
    q: "How does the AI capture work?",
    a: "Simply paste a webpage link or block of raw copy text. Our system parses the opportunity sponsor, name, guidelines, URLs, and exact deadline time to build your vault profile dynamically.",
  },
  {
    q: "How are reminders dispatched?",
    a: "We execute a centralized cron service. Based on your account's selected local timezone, the service schedules emails to notify you at fixed windows (e.g., 7 days or 24 hours before submission).",
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Simulated AI Capture Interactive state
  const [urlInput, setUrlInput] = useState("https://www.schwarzmanscholars.org/apply");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  // Simulated Analytics Interactive tab
  const [activeMetricTab, setActiveMetricTab] = useState<"velocity" | "category" | "pipeline">("velocity");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSimulateParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setParsedData({
        title: "Schwarzman Scholars Fellowship",
        organization: "Tsinghua University",
        deadline: "2026-09-20",
        category: "FELLOWSHIP",
        priority: "HIGH",
        status: "NOT_STARTED",
      });
      setIsParsing(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* 1. Header Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-border"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center space-x-3 select-none">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-xl tracking-tight">
              Apply Away
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
            <a href="#compare" className="hover:text-foreground transition-colors">Why Vault</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          {/* Actions & Theme Toggles */}
          <div className="flex items-center space-x-4">
            {/* Animated Theme Controller */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-purple-500/30 transition-all cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label="Toggle visual theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            <Link
              href="/login"
              className="text-xs font-bold hover:text-purple-400 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/login"
              className="h-9 px-4 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white flex items-center justify-center shadow-lg shadow-purple-600/25 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden px-4 sm:px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Side: Branding Message */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase tracking-widest mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Opportunity Vault</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-outfit">
              Never miss another <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-indigo-400 to-sky-400">
                life-changing
              </span>{" "}
              opportunity.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Consolidate scholarships, research grants, fellowships, and career opportunities into one beautiful workspace. Automatically parse deadlines and sync notifications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="h-12 px-6 w-full sm:w-auto rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="h-12 px-5 w-full sm:w-auto rounded-xl border border-border bg-card/30 hover:bg-card hover:border-purple-500/20 text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                <span>See How It Works</span>
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Tenant Vault Database Isolation</span>
            </div>
          </div>

          {/* Hero Right Side: Interactive Mock Product Interface (70% Visual Emphasis) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md shadow-2xl p-4 sm:p-5 overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
              {/* Browser window title-bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-6 py-0.5 rounded-lg bg-background/60 border border-border/40 text-[10px] font-mono text-muted-foreground max-w-xs truncate">
                  apply-away.app/dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* Mock Dashboard Layout */}
              <div className="pt-5 space-y-5">
                
                {/* Metric Summary Standardized Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Vault</span>
                    <div className="text-lg font-bold font-outfit">18 Records</div>
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1">
                    <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">In Progress</span>
                    <div className="text-lg font-bold font-outfit text-sky-400">5 Active</div>
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1">
                    <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Due Soon</span>
                    <div className="text-lg font-bold font-outfit text-purple-400">2 Weeks</div>
                  </div>
                </div>

                {/* Simulated AI Quick Capture Panel */}
                <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/[0.02] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-400">
                      <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>Interactive AI Capture Demo</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase">
                      Try clicking below
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={urlInput}
                      className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleSimulateParse}
                      disabled={isParsing}
                      className="h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isParsing ? "Extracting..." : "Parse link"}
                    </button>
                  </div>

                  {/* Parse Results */}
                  {parsedData ? (
                    <div className="p-3 rounded-lg bg-background border border-emerald-500/20 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{parsedData.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase border border-emerald-500/20">
                          {parsedData.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                        <div>Deadline: <strong className="text-slate-300">{parsedData.deadline}</strong></div>
                        <div>Priority: <strong className="text-amber-400">{parsedData.priority}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground italic text-center py-1">
                      Click &apos;Parse link&apos; to simulate extracting details from guidelines.
                    </div>
                  )}
                </div>

                {/* Pipeline List View mockup */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vault Pipeline</div>
                  <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div>
                        <div className="font-semibold text-white">Rhodes Scholarship Application</div>
                        <div className="text-[10px] text-muted-foreground">Oxford University</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold uppercase text-[9px]">
                      HIGH PRIORITY
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-semibold text-white">National Science Foundation Grant</div>
                        <div className="text-[10px] text-muted-foreground">NSF Research Portal</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase text-[9px]">
                      SUBMITTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust Section */}
      <section className="py-12 border-t border-b border-border/60 bg-card/20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide select-none text-center sm:text-left">
            Trusted by ambitious students and researchers worldwide
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-extrabold tracking-widest text-muted-foreground/60 select-none cursor-default hover:text-muted-foreground transition-colors font-outfit"
              >
                {name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-card/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Simplifying Tracking</div>
            <h2 className="text-3xl font-bold font-outfit text-white">Paste, Extract, Automate.</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Say goodbye to messy bookmarks and spreadsheets. We parse structural parameters and cron notify your timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="glass-card p-6 rounded-2xl space-y-4 hover:border-purple-500/20 transition-all"
              >
                <div className="text-3xl font-extrabold font-outfit text-purple-500/35">{step.num}</div>
                <h3 className="text-base font-bold font-outfit text-white">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                
                {/* Visual Indicators */}
                <div className="pt-4 h-24 rounded-xl bg-background/60 border border-border/50 flex items-center justify-center p-3">
                  {step.visual === "LINK_CAPTURE" && (
                    <div className="w-full space-y-2">
                      <div className="h-6 rounded bg-slate-900 border border-border/60 text-[10px] text-purple-400 flex items-center px-2 select-none overflow-hidden truncate">
                        https://gatesfoundation.org/grant-apply
                      </div>
                    </div>
                  )}
                  {step.visual === "AI_PARSER" && (
                    <div className="flex space-x-2 items-center text-xs text-purple-300 font-mono">
                      <Wand2 className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span>Parsing guidelines...</span>
                    </div>
                  )}
                  {step.visual === "TIMELINE_CRON" && (
                    <div className="flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Cron triggers armed (UTC +1)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Grid Section */}
      <section id="features" className="py-24 px-4 sm:px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Platform capabilities</div>
            <h2 className="text-3xl font-bold font-outfit text-white">Full-Suite Pipeline Engine</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Designed for high-productivity students, researchers, and early-career innovators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPONENT_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="glass-card p-6 rounded-2xl flex flex-col justify-between h-56 hover:border-purple-500/20 transition-all"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold font-outfit text-white">{feat.title}</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-background border border-border text-slate-400">
                      {feat.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Product Showcase Section */}
      <section id="showcase" className="py-24 px-4 sm:px-6 bg-card/10">
        <div className="max-w-7xl mx-auto space-y-20">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Product Showcase</div>
            <h2 className="text-3xl font-bold font-outfit text-white">High-Fidelity Interface</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A visually premium dashboard tailored specifically to opportunity vault tracking.
            </p>
          </div>

          {/* Alternate Grid Showcase (Left / Right Layouts) */}
          <div className="space-y-20">
            
            {/* Showcase 1: Analytics and Velocity Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold font-outfit text-white">Reflection & Analytics</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Track application velocity curves, conversion pipelines (Not Started → Submitted → Accepted), and categories breakdown. Visual charts provide an instant health audit of your career progression.
                </p>
                <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
                  <span>Standard chart rendering via Recharts library</span>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-border space-y-4 shadow-xl">
                  {/* Mock Analytics Panel */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/50 text-xs">
                    <span className="font-bold text-white">Application Velocity Index</span>
                    <div className="flex space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-400">6 MONTHS</span>
                    </div>
                  </div>
                  
                  {/* Simulated Recharts Velocity Line/Bar Graph */}
                  <div className="h-48 rounded-xl bg-background/80 border border-border/60 flex items-end justify-between p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-purple-500/[0.02] to-transparent pointer-events-none" />
                    
                    {/* Simulated vertical bar lines */}
                    <div className="w-10 flex flex-col justify-end items-center space-y-2 h-full">
                      <div className="w-2.5 bg-purple-500/30 rounded-t h-[30%]" />
                      <div className="w-2.5 bg-purple-500/90 rounded-t h-[45%]" />
                      <span className="text-[8px] text-slate-500">Mar</span>
                    </div>
                    <div className="w-10 flex flex-col justify-end items-center space-y-2 h-full">
                      <div className="w-2.5 bg-purple-500/30 rounded-t h-[40%]" />
                      <div className="w-2.5 bg-purple-500/90 rounded-t h-[60%]" />
                      <span className="text-[8px] text-slate-500">Apr</span>
                    </div>
                    <div className="w-10 flex flex-col justify-end items-center space-y-2 h-full">
                      <div className="w-2.5 bg-purple-500/30 rounded-t h-[20%]" />
                      <div className="w-2.5 bg-purple-500/90 rounded-t h-[75%]" />
                      <span className="text-[8px] text-slate-500">May</span>
                    </div>
                    <div className="w-10 flex flex-col justify-end items-center space-y-2 h-full">
                      <div className="w-2.5 bg-purple-500/30 rounded-t h-[60%]" />
                      <div className="w-2.5 bg-purple-500/90 rounded-t h-[90%]" />
                      <span className="text-[8px] text-slate-500">Jun</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-purple-500/30" /> <span>Created</span></span>
                    <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-purple-500" /> <span>Submitted</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase 2: Month Calendar Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 order-last lg:order-first">
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-border shadow-xl space-y-4">
                  {/* Mock Month Calendar Layout */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/50 text-xs">
                    <span className="font-bold text-white">September 2026</span>
                    <span className="text-[10px] text-muted-foreground">FullCalendar integration</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Days */}
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const hasDeadline = dayNum === 14 || dayNum === 20;
                      return (
                        <div
                          key={idx}
                          className={`h-10 rounded-lg border border-border/40 bg-background/40 flex flex-col justify-between p-1.5 ${
                            hasDeadline ? "border-purple-500/30 bg-purple-500/[0.02]" : ""
                          }`}
                        >
                          <span className="text-[8px] text-slate-500">{dayNum}</span>
                          {hasDeadline && (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 self-end" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold font-outfit text-white">Deadline Calendar View</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Consolidated timeline display highlighting upcoming fellowship, scholarship, and grant deadlines. Standard priority tags render high, medium, and low colors to organize your study windows.
                </p>
                <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
                  <span>Synchronized with custom client dynamic loader</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Comparison: spreadsheets vs. Apply Away */}
      <section id="compare" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Modern Workflows</div>
            <h2 className="text-3xl font-bold font-outfit text-white">Manual Spreadsheets vs. Apply Away</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Why spreadsheet tracking fails active students and early-career professionals.
            </p>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-border shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-slate-900/60 font-bold text-white uppercase tracking-wider">
                    <th className="p-4">Tracking criteria</th>
                    <th className="p-4 border-l border-border/60">Traditional tracking</th>
                    <th className="p-4 border-l border-border/60 text-purple-300">Apply Away Vault</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ITEMS.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border/40 hover:bg-card/25 transition-colors"
                    >
                      <td className="p-4 font-semibold text-white">{item.label}</td>
                      <td className="p-4 border-l border-border/60 text-muted-foreground">
                        <span className="inline-flex items-center space-x-1.5">
                          <X className="w-4 h-4 text-rose-500" />
                          <span>{item.without}</span>
                        </span>
                      </td>
                      <td className="p-4 border-l border-border/60 text-slate-200">
                        <span className="inline-flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-medium">{item.with}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Statistics Section */}
      <section className="py-24 px-4 sm:px-6 bg-card/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-extrabold font-outfit text-white">95%</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Applications Never Missed</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-extrabold font-outfit text-white">10x</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Faster Organization</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-extrabold font-outfit text-white">500+</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Hours Saved Tracking</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-extrabold font-outfit text-white">100%</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Deadline Awareness</div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Any Questions?</div>
            <h2 className="text-3xl font-bold font-outfit text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need to know about the Apply Away opportunity management engine.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl overflow-hidden border border-border/80 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    type="button"
                    className="w-full p-5 flex items-center justify-between text-left font-bold font-outfit text-sm text-white hover:bg-slate-900/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-48 border-t border-border/50" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-xs text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Colorful Glow Backgrounds */}
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/10 via-indigo-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-16 rounded-3xl text-center space-y-6 relative z-10 border border-purple-500/25 shadow-2xl">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-500 items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit text-white">
            Your next opportunity could change your life. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 font-bold">
              Start organizing today.
            </span>
          </h2>
          
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Create your account today and experience structured AI opportunity organization. Free to get started, no credit card required.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              href="/login"
              className="h-12 px-8 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Footer Section */}
      <footer className="border-t border-border/80 bg-slate-950/60 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Brand column */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 select-none">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-outfit font-extrabold text-lg tracking-tight text-white">
                Apply Away
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Automate and track fellowships, scholarships, internships, grants, and career pipelines in one secure vault.
            </p>
          </div>

          {/* Links column 1 */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Resources</div>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Platform Features</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">Step-by-Step Guide</a></li>
              <li><a href="#showcase" className="hover:text-purple-400 transition-colors">Interface Gallery</a></li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Vault Security</div>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              <li><span className="flex items-center space-x-1.5"><Lock className="w-3 h-3 text-purple-400" /> <span>Multi-Tenant DB</span></span></li>
              <li><span className="flex items-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> <span>Session Encrypted</span></span></li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            Apply Away &copy; {new Date().getFullYear()} – Premium AI Opportunity Vault. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
