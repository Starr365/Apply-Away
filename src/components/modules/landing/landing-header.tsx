"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/85 backdrop-blur-md border-border shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo Branding */}
        <a
          href="#hero"
          onClick={scrollToHero}
          className="flex items-center space-x-3 select-none cursor-pointer group"
          aria-label="Apply Away Home"
        >
          {/* Mobile Icon */}
          <div className="relative w-9 h-9 shrink-0 md:hidden">
            <Image
              src="/vault-logo.png"
              alt="Apply Away Icon"
              fill
              sizes="36px"
              priority
              className="object-contain"
            />
          </div>
          {/* Desktop Full Logo */}
          <div className="relative h-10 w-44 shrink-0 hidden md:block">
            <Image
              src="/valut-text-logo.png"
              alt="Apply Away Logo"
              fill
              sizes="176px"
              priority
              className="object-contain dark:invert transition-all"
            />
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-medium text-muted-foreground">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "hero")}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, "how-it-works")}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, "features")}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#faq"
            onClick={(e) => handleNavClick(e, "faq")}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            FAQ
          </a>
        </nav>

        {/* Actions & Theme Toggles */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl border border-border bg-card hover:bg-secondary transition-all cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          <Link href="/auth">
            <Button variant="secondary" size="sm" className="bg-secondary/80 hover:bg-secondary border border-border text-foreground font-bold">
              Log in
            </Button>
          </Link>

          <Link href="/auth">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl border border-border bg-card text-muted-foreground"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 rounded-xl border border-border bg-card text-foreground"
            aria-label="Open mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-foreground">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "hero")}
              className="py-2 border-b border-border/40 hover:text-primary"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="py-2 border-b border-border/40 hover:text-primary"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="py-2 border-b border-border/40 hover:text-primary"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, "faq")}
              className="py-2 border-b border-border/40 hover:text-primary"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-2 flex flex-col space-y-3">
            <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="md" className="w-full justify-center">
                Log in
              </Button>
            </Link>

            <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
