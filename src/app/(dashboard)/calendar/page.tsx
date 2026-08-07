import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarView } from "@/components/modules/calendar/calendar-view";

const repository = new PrismaOpportunityRepository();

export default async function CalendarPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !session) {
    return null; // Handled by middleware
  }

  // Fetch opportunities with deadlines for this user
  const { items: opportunities } = await repository.findAll({
    userId,
    limit: 100, // Fetch up to 100 opportunities for calendar view
    sortBy: "deadline",
    sortOrder: "asc",
  });

  return (
    <DashboardLayout session={session} showBackButton footerLabel="Deadline Calendar">
      <div className="space-y-6">
        <PageHeader
          title="Application Deadline Calendar"
          description="Visual month overview of all upcoming application deadlines and key dates."
        />
        <CalendarView opportunities={opportunities} />
      </div>
    </DashboardLayout>
  );
}

