import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarView } from "@/components/modules/calendar/calendar-view";

const repository = new PrismaOpportunityRepository();

export default async function CalendarPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // Fetch opportunities with deadlines for this user
  const { items: opportunities } = await repository.findAll({
    userId,
    limit: 100, // Fetch up to 100 opportunities for calendar view
    sortBy: "deadline",
    sortOrder: "asc",
  });

  // Track analytics event: calendar_viewed
  const { trackEvent } = await import("@/lib/analytics");
  await trackEvent({
    eventName: "calendar_viewed",
    userId,
    metadata: { count: opportunities.length },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Deadline Calendar"
        description="Visual month overview of all upcoming application deadlines and key dates."
      />
      <CalendarView opportunities={opportunities} />
    </div>
  );
}


