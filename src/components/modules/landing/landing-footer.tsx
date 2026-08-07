"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/80 bg-slate-950/60 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        
        {/* Logo Brand column */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-3 select-none">
            <div className="relative h-7 w-28">
              <Image
                src="/text-vault.png"
                alt="Apply Away Logo"
                fill
                sizes="112px"
                className="object-contain dark:invert transition-all"
              />
            </div>
          </Link>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Automate and track fellowships, scholarships, internships, grants, and career pipelines in one secure vault.
          </p>
        </div>

        {/* Links column 1 */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider select-none">Resources</div>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            <li><a href="#features" className="hover:text-purple-400 transition-colors">Platform Features</a></li>
            <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">Step-by-Step Guide</a></li>
            <li><a href="#showcase" className="hover:text-purple-400 transition-colors">Interface Gallery</a></li>
          </ul>
        </div>

        {/* Links column 2 */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider select-none">Vault Security</div>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            <li><span className="flex items-center space-x-1.5"><Lock className="w-3 h-3 text-purple-400" /> <span>Multi-Tenant DB</span></span></li>
            <li><span className="flex items-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> <span>Session Encrypted</span></span></li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <div className="select-none">
          Apply Away &copy; {new Date().getFullYear()} – Premium AI Opportunity Vault. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
