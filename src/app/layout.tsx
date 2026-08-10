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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://applyaway.mmesomanzeribe.me";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Apply Away – AI-Powered Personal Opportunity Vault",
    template: "%s | Apply Away",
  },
  description:
    "Centralize, organize, track, and manage scholarships, fellowships, grants, and career opportunities in one modern AI-powered vault with deadline alerts.",
  keywords: [
    "Opportunity Vault",
    "Scholarship Tracker",
    "Fellowship Management",
    "Grant Tracker",
    "AI Quick Capture",
    "Deadline Reminders",
    "Career Opportunities",
  ],
  authors: [{ name: "Apply Away Team", url: baseUrl }],
  creator: "Apply Away",
  publisher: "Apply Away",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/vault-logo.png" },
      { url: "/vault-logo.png", type: "image/png" },
    ],
    shortcut: ["/vault-logo.png"],
    apple: [{ url: "/vault-logo.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Apply Away – AI-Powered Personal Opportunity Vault",
    description:
      "Centralize, organize, track, and manage scholarships, fellowships, grants, and career opportunities in one modern AI-powered vault with deadline alerts.",
    siteName: "Apply Away",
    images: [
      {
        url: "/vault-logo.png",
        width: 512,
        height: 512,
        alt: "Apply Away Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply Away – AI-Powered Personal Opportunity Vault",
    description:
      "Centralize, organize, track, and manage scholarships, fellowships, grants, and career opportunities in one modern AI-powered vault.",
    images: ["/vault-logo.png"],
  },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Apply Away",
    "url": baseUrl,
    "logo": `${baseUrl}/vault-logo.png`,
    "description":
      "Centralize, organize, track, and manage scholarships, fellowships, grants, and career opportunities in one modern AI-powered vault with deadline alerts.",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
