"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading Auth...</div>}>
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-background text-foreground transition-colors duration-300">
        <div className="w-full max-w-7xl px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Product Showcase */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="hidden lg:inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
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
              <h1 className="hidden lg:block text-3xl sm:text-4xl font-extrabold font-outfit tracking-tight text-foreground leading-tight">
                Manage all opportunities from one central vault.
              </h1>
              <p className="hidden lg:block text-sm text-muted-foreground leading-relaxed">
                Save opportunities from URLs or copied text, automatically extract structured data with AI, track deadlines, and reflect on your application journey.
              </p>
            </div>

            <div className="hidden lg:block space-y-3 pt-2 text-xs font-medium text-muted-foreground">
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

          {/* Right Column: Auth Forms Wrapper */}
          <div className="lg:col-span-5">
            {children}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
