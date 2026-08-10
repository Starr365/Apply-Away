import { prisma } from "@/lib/prisma";

export type DateRangeKey = "today" | "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
  rangeKey: DateRangeKey;
}

export function calculateDateRange(key: DateRangeKey = "30d", customStart?: string, customEnd?: string): DateRange {
  const endDate = new Date();
  let startDate = new Date();
  let durationMs = 30 * 24 * 60 * 60 * 1000;

  if (key === "today") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    durationMs = 24 * 60 * 60 * 1000;
  } else if (key === "7d") {
    durationMs = 7 * 24 * 60 * 60 * 1000;
    startDate = new Date(endDate.getTime() - durationMs);
  } else if (key === "30d") {
    durationMs = 30 * 24 * 60 * 60 * 1000;
    startDate = new Date(endDate.getTime() - durationMs);
  } else if (key === "90d") {
    durationMs = 90 * 24 * 60 * 60 * 1000;
    startDate = new Date(endDate.getTime() - durationMs);
  } else if (key === "custom" && customStart && customEnd) {
    startDate = new Date(customStart);
    const end = new Date(customEnd);
    durationMs = Math.max(end.getTime() - startDate.getTime(), 24 * 60 * 60 * 1000);
  }

  const prevEndDate = new Date(startDate.getTime());
  const prevStartDate = new Date(prevEndDate.getTime() - durationMs);

  return {
    startDate,
    endDate,
    prevStartDate,
    prevEndDate,
    rangeKey: key,
  };
}

export interface MetricWithComparison {
  current: number;
  previous: number;
  changePercentage: number;
  direction: "up" | "down" | "flat";
}

function calculateChange(current: number, previous: number): MetricWithComparison {
  if (previous === 0) {
    return {
      current,
      previous,
      changePercentage: current > 0 ? 100 : 0,
      direction: current > 0 ? "up" : "flat",
    };
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;
  return {
    current,
    previous,
    changePercentage: rounded,
    direction: rounded > 0 ? "up" : rounded < 0 ? "down" : "flat",
  };
}

export class AdminAnalyticsService {
  /**
   * Primary KPI Cards: Visitors, Sign-ups, Activated Users, Opportunities Saved
   */
  async getPrimaryKPIs(range: DateRange) {
    // Current period counts
    const [currentVisitors, currentSignups, currentActivated, currentSaved] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          eventName: "page_view",
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }),
      prisma.opportunity.groupBy({
        by: ["userId"],
        where: {
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }).then((res) => res.length),
      prisma.opportunity.count({
        where: {
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }),
    ]);

    // Previous period counts
    const [prevVisitors, prevSignups, prevActivated, prevSaved] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          eventName: "page_view",
          createdAt: { gte: range.prevStartDate, lte: range.prevEndDate },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: range.prevStartDate, lte: range.prevEndDate },
        },
      }),
      prisma.opportunity.groupBy({
        by: ["userId"],
        where: {
          createdAt: { gte: range.prevStartDate, lte: range.prevEndDate },
        },
      }).then((res) => res.length),
      prisma.opportunity.count({
        where: {
          createdAt: { gte: range.prevStartDate, lte: range.prevEndDate },
        },
      }),
    ]);

    return {
      visitors: calculateChange(currentVisitors, prevVisitors),
      signups: calculateChange(currentSignups, prevSignups),
      activatedUsers: calculateChange(currentActivated, prevActivated),
      opportunitiesSaved: calculateChange(currentSaved, prevSaved),
    };
  }

  /**
   * Traffic Analytics line chart dataset
   */
  async getTrafficAnalytics(range: DateRange) {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        eventName: "page_view",
        createdAt: { gte: range.startDate, lte: range.endDate },
      },
      select: {
        createdAt: true,
        sessionId: true,
        userId: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const datesMap: Record<string, { total: number; newVisitors: number; returningVisitors: number }> = {};

    events.forEach((ev) => {
      const dayKey = ev.createdAt.toISOString().split("T")[0];
      if (!datesMap[dayKey]) {
        datesMap[dayKey] = { total: 0, newVisitors: 0, returningVisitors: 0 };
      }
      datesMap[dayKey].total += 1;
      if (!ev.userId) {
        datesMap[dayKey].newVisitors += 1;
      } else {
        datesMap[dayKey].returningVisitors += 1;
      }
    });

    return Object.entries(datesMap).map(([date, counts]) => ({
      date,
      visitors: counts.total,
      newVisitors: counts.newVisitors,
      returningVisitors: counts.returningVisitors,
    }));
  }

  /**
   * Traffic Sources & Conversion Table
   */
  async getTrafficSources(range: DateRange) {
    const pageViews = await prisma.analyticsEvent.findMany({
      where: {
        eventName: "page_view",
        createdAt: { gte: range.startDate, lte: range.endDate },
      },
      select: { source: true, sessionId: true },
    });

    const signups = await prisma.analyticsEvent.findMany({
      where: {
        eventName: "sign_up",
        createdAt: { gte: range.startDate, lte: range.endDate },
      },
      select: { source: true },
    });

    const sourcesMap: Record<string, { visitors: number; signups: number }> = {
      Direct: { visitors: 0, signups: 0 },
      Google: { visitors: 0, signups: 0 },
      LinkedIn: { visitors: 0, signups: 0 },
      TikTok: { visitors: 0, signups: 0 },
      Instagram: { visitors: 0, signups: 0 },
      Other: { visitors: 0, signups: 0 },
    };

    const normalizeSource = (src?: string | null): string => {
      if (!src) return "Direct";
      const s = src.toLowerCase();
      if (s.includes("google")) return "Google";
      if (s.includes("linkedin")) return "LinkedIn";
      if (s.includes("tiktok")) return "TikTok";
      if (s.includes("instagram")) return "Instagram";
      return "Other";
    };

    pageViews.forEach((pv) => {
      const srcName = normalizeSource(pv.source);
      sourcesMap[srcName].visitors += 1;
    });

    signups.forEach((su) => {
      const srcName = normalizeSource(su.source);
      sourcesMap[srcName].signups += 1;
    });

    return Object.entries(sourcesMap).map(([source, data]) => ({
      source,
      visitors: data.visitors,
      signups: data.signups,
      conversionRate:
        data.visitors > 0 ? Math.round((data.signups / data.visitors) * 1000) / 10 : 0,
    }));
  }

  /**
   * UTM Campaign Tracking
   */
  async getUtmCampaigns(range: DateRange) {
    const campaigns = await prisma.analyticsEvent.groupBy({
      by: ["campaign", "source"],
      where: {
        campaign: { not: null },
        createdAt: { gte: range.startDate, lte: range.endDate },
      },
      _count: { id: true },
    });

    const results = await Promise.all(
      campaigns.map(async (c) => {
        const campaignName = c.campaign || "Unassigned";
        const [visitors, signups] = await Promise.all([
          prisma.analyticsEvent.count({
            where: {
              campaign: c.campaign,
              eventName: "page_view",
              createdAt: { gte: range.startDate, lte: range.endDate },
            },
          }),
          prisma.analyticsEvent.count({
            where: {
              campaign: c.campaign,
              eventName: "sign_up",
              createdAt: { gte: range.startDate, lte: range.endDate },
            },
          }),
        ]);

        return {
          campaign: campaignName,
          source: c.source || "Direct",
          visitors,
          signups,
          activationRate: visitors > 0 ? Math.round((signups / visitors) * 1000) / 10 : 0,
        };
      })
    );

    return results.sort((a, b) => b.visitors - a.visitors);
  }

  /**
   * Signup & Product Activation Funnel
   */
  async getSignupFunnel(range: DateRange) {
    const [visitors, signups, activatedUsers] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          eventName: "page_view",
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }),
      prisma.opportunity.groupBy({
        by: ["userId"],
        where: {
          createdAt: { gte: range.startDate, lte: range.endDate },
        },
      }).then((res) => res.length),
    ]);

    const visitorToSignup = visitors > 0 ? Math.round((signups / visitors) * 1000) / 10 : 0;
    const signupToActivation = signups > 0 ? Math.round((activatedUsers / signups) * 1000) / 10 : 0;

    return {
      visitors,
      signups,
      activatedUsers,
      visitorToSignup,
      signupToActivation,
    };
  }

  /**
   * Core Product Usage Event Distribution
   */
  async getProductUsage(range: DateRange) {
    const events = await prisma.analyticsEvent.groupBy({
      by: ["eventName"],
      where: {
        eventName: {
          in: [
            "opportunity_saved",
            "ai_extraction_used",
            "opportunity_viewed",
            "calendar_viewed",
            "status_updated",
          ],
        },
        createdAt: { gte: range.startDate, lte: range.endDate },
      },
      _count: { id: true },
    });

    const labelMap: Record<string, string> = {
      opportunity_saved: "Opportunities Saved",
      ai_extraction_used: "AI Extractions Used",
      opportunity_viewed: "Opportunity Detail Views",
      calendar_viewed: "Calendar Views",
      status_updated: "Status Updates",
    };

    return events.map((e) => ({
      event: labelMap[e.eventName] || e.eventName,
      count: e._count.id,
    }));
  }

  /**
   * User Growth Velocity (New Users vs Total Users)
   */
  async getUserGrowth(range: DateRange) {
    const newUsers = await prisma.user.findMany({
      where: {
        createdAt: { gte: range.startDate, lte: range.endDate },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const datesMap: Record<string, number> = {};
    newUsers.forEach((u) => {
      const dayKey = u.createdAt.toISOString().split("T")[0];
      datesMap[dayKey] = (datesMap[dayKey] || 0) + 1;
    });

    let runningTotal = await prisma.user.count({
      where: { createdAt: { lt: range.startDate } },
    });

    return Object.entries(datesMap).map(([date, count]) => {
      runningTotal += count;
      return {
        date,
        newUsers: count,
        totalUsers: runningTotal,
      };
    });
  }

  /**
   * Growth Reflection Engine (Rule-based decision insights)
   */
  async getOwnerReflection(range: DateRange) {
    const [trafficSources, funnel, kpis] = await Promise.all([
      this.getTrafficSources(range),
      this.getSignupFunnel(range),
      this.getPrimaryKPIs(range),
    ]);

    const bestChannel = [...trafficSources].sort((a, b) => b.signups - a.signups)[0];
    const workingText =
      bestChannel && bestChannel.signups > 0
        ? `${bestChannel.source} is currently your strongest acquisition channel with ${bestChannel.signups} new sign-ups.`
        : "Direct organic traffic is driving early adoption for Apply Away.";

    const highTrafficLowConv = trafficSources.find(
      (s) => s.visitors > 10 && s.conversionRate < 5
    );

    const attentionText = highTrafficLowConv
      ? `${highTrafficLowConv.source} is generating high visitor traffic but converting under 5% into registered users.`
      : funnel.signupToActivation < 30
      ? "User activation is under 30%. Focus on nudging new signups to save their first opportunity."
      : "Acquisition pipeline is healthy across all channels.";

    const nextDecisionText =
      kpis.activatedUsers.changePercentage > 0
        ? "User activation improved over last period. Double down on AI Quick Capture onboarding features."
        : "Focus landing page copy on the AI Quick Capture speed benefit to boost visitor conversion.";

    return {
      whatsWorking: workingText,
      whatsNeedsAttention: attentionText,
      nextDecision: nextDecisionText,
    };
  }

  /**
   * Recent Activity Log (Privacy-safe owner feed)
   */
  async getRecentActivity() {
    const logs = await prisma.analyticsEvent.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        eventName: true,
        createdAt: true,
        source: true,
      },
    });

    const eventLabelMap: Record<string, string> = {
      page_view: "Website Page View",
      sign_up: "New User Registered",
      login: "User Logged In",
      opportunity_saved: "Opportunity Saved to Vault",
      ai_extraction_used: "AI Opportunity Extraction Used",
      opportunity_viewed: "Opportunity Details Opened",
      calendar_viewed: "Calendar View Opened",
      status_updated: "Opportunity Status Changed",
    };

    return logs.map((log) => ({
      id: log.id,
      event: eventLabelMap[log.eventName] || log.eventName,
      timestamp: log.createdAt,
      source: log.source || "Direct",
    }));
  }
}
