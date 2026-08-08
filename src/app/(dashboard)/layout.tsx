import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/ui/dashboard-layout";

interface DashboardRootLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardRootLayout({ children }: DashboardRootLayoutProps) {
  const session = await auth();

  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}
