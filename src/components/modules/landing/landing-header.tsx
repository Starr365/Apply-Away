"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { Sparkles, Sun, Moon } from "lucide-react";

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          <span className="font-outfit font-extrabold text-xl tracking-tight text-foreground">
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
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-purple-500/30 transition-all cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          <Link
            href="/login"
            className="text-xs font-bold hover:text-purple-400 transition-colors text-foreground"
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
  );
}
