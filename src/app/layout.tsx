import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { PwaRegister } from "@/components/providers/pwa-register";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apply Away – AI-Powered Personal Opportunity Vault",
  description:
    "Collect, organize, track, and manage fellowships, scholarships, grants, and career opportunities in one centralized AI-powered vault.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Apply Away",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-background text-foreground selection:bg-purple-500 selection:text-white min-h-screen flex flex-col transition-colors duration-300"
      >
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <PwaRegister />
              <main className="flex-1">{children}</main>
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
