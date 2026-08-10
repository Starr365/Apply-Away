import { requireOwnerAdmin } from "@/lib/auth-admin";
import { getOwnerAnalyticsDataAction } from "@/app/actions/admin-analytics.actions";
import { AdminAnalyticsView } from "@/components/modules/analytics/admin-analytics-view";

export default async function AdminAnalyticsPage() {
  await requireOwnerAdmin();

  const initialRes = await getOwnerAnalyticsDataAction("30d");

  if (!initialRes.success || !initialRes.data) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-destructive">Analytics System Error</h2>
        <p className="text-xs text-muted-foreground">
          {initialRes.error || "Unable to fetch owner analytics metrics."}
        </p>
      </div>
    );
  }

  return <AdminAnalyticsView initialData={initialRes.data} initialRange="30d" />;
}
