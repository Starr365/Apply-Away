import type { Metadata } from "next";
import { trackEvent } from "@/lib/analytics";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Apply Away – Never miss another life-changing opportunity",
  description:
    "An AI-powered Opportunity Management Platform that helps students and young professionals organize, track, and manage scholarships, fellowships, grants, and career opportunities.",
};

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth();
    await trackEvent({
      eventName: "page_view",
      userId: session?.user?.id || null,
      metadata: { path: "/" },
    });
  } catch {
    // Fail silently in render path
  }

  return <>{children}</>;
}
