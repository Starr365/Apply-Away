import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply Away – Never miss another life-changing opportunity",
  description:
    "An AI-powered Opportunity Management Platform that helps students and young professionals organize, track, and manage scholarships, fellowships, grants, and career opportunities.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
