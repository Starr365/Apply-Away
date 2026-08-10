"use server";

import { getAdminSession } from "@/lib/auth-admin";
import {
  AdminAnalyticsService,
  DateRangeKey,
  calculateDateRange,
} from "@/services/admin-analytics.service";

const analyticsService = new AdminAnalyticsService();

export async function getOwnerAnalyticsDataAction(
  rangeKey: DateRangeKey = "30d",
  customStart?: string,
  customEnd?: string
) {
  const { isOwner } = await getAdminSession();
  if (!isOwner) {
    return { success: false, error: "Unauthorized access. Owner permissions required." };
  }

  try {
    const range = calculateDateRange(rangeKey, customStart, customEnd);

    const [
      kpis,
      trafficAnalytics,
      trafficSources,
      utmCampaigns,
      signupFunnel,
      productUsage,
      userGrowth,
      reflection,
      recentActivity,
    ] = await Promise.all([
      analyticsService.getPrimaryKPIs(range),
      analyticsService.getTrafficAnalytics(range),
      analyticsService.getTrafficSources(range),
      analyticsService.getUtmCampaigns(range),
      analyticsService.getSignupFunnel(range),
      analyticsService.getProductUsage(range),
      analyticsService.getUserGrowth(range),
      analyticsService.getOwnerReflection(range),
      analyticsService.getRecentActivity(),
    ]);

    return {
      success: true,
      data: {
        kpis,
        trafficAnalytics,
        trafficSources,
        utmCampaigns,
        signupFunnel,
        productUsage,
        userGrowth,
        reflection,
        recentActivity,
      },
    };
  } catch (error) {
    console.error("[AdminAnalytics] Failed to fetch metrics:", error);
    return { success: false, error: "Failed to fetch analytics data." };
  }
}
