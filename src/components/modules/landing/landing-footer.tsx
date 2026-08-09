"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/60 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-left">
        {/* Brand column */}
        <div className="space-y-3 md:col-span-2">
          <Link href="/" className="flex items-center space-x-3 select-none">
            <div className="relative h-10 w-40 shrink-0">
              <Image
                src="/text-vault.png"
                alt="Apply Away Logo"
                fill
                sizes="160px"
                className="object-contain dark:invert transition-all"
              />
            </div>
          </Link>
          <p className="text-xs font-semibold text-primary">Your opportunity vault.</p>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Save, organize, track, and reflect on scholarships, fellowships, internships, grants, jobs, and research opportunities.
          </p>
        </div>

        {/* Product Column */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider select-none">Product</div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider select-none">Resources</div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Opportunity Vault</Link></li>
            <li><Link href="/calendar" className="hover:text-primary transition-colors">Calendar</Link></li>
            <li><Link href="/reflection" className="hover:text-primary transition-colors">Reflection</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider select-none">Legal</div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
        <div className="select-none flex items-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Apply Away &copy; {new Date().getFullYear()} – Opportunity Vault SaaS</span>
        </div>
      </div>
    </footer>
  );
}
