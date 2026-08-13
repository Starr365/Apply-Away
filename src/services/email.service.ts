import nodemailer from "nodemailer";
import { retryWithBackoff } from "@/lib/retry";
import { getAppUrl } from "@/lib/app-url";

export interface SendReminderEmailParams {
  toEmail: string;
  userName: string;
  opportunityTitle: string;
  organization: string;
  reminderTypeLabel: string;
  deadlineFormatted: string;
  userTimezone: string;
  opportunityUrl?: string;
}

export interface DigestItem {
  title: string;
  organization: string;
  deadlineFormatted: string;
  /** Whole calendar days until the deadline in the user's timezone. 0 = due today. */
  daysLeft: number;
  url: string;
}

export interface SendDigestEmailParams {
  toEmail: string;
  userName: string;
  userTimezone: string;
  items: DigestItem[];
}

/** Accent colour and label per remaining-days bucket, most urgent first. */
const DIGEST_URGENCY: Record<number, { accent: string; label: string }> = {
  0: { accent: "#f43f5e", label: "Due Today" },
  1: { accent: "#fb923c", label: "1 Day Remaining" },
  3: { accent: "#fbbf24", label: "3 Days Remaining" },
  7: { accent: "#a78bfa", label: "7 Days Remaining" },
  14: { accent: "#38bdf8", label: "14 Days Remaining" },
};

/** Escape user-supplied values before interpolating them into email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private resendApiKey: string | null = null;
  private defaultFrom: string;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || null;
    this.defaultFrom =
      process.env.EMAIL_FROM ||
      process.env.SMTP_FROM ||
      '"Apply Away" <notifications@applyaway.mmesomanzeribe.me>';

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  }

  /**
   * POST to the Resend API. Throws on any non-2xx response.
   *
   * Throwing (rather than returning false) is deliberate: it is what allows
   * retryWithBackoff to actually retry, and what stops a failed send from being
   * reported to callers as a delivered one.
   */
  private async sendViaResendApi(params: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail =
        (data as { message?: string; name?: string }).message ||
        (data as { name?: string }).name ||
        JSON.stringify(data);
      throw new Error(`Resend API ${response.status}: ${detail}`);
    }

    console.log(
      `[EmailService RESEND API SUCCESS] Sent email to ${params.to}, id: ${(data as { id?: string }).id}`
    );
  }

  /**
   * Single dispatch path shared by every outbound email.
   *
   * Order of preference: Resend, then SMTP. Mock mode is reached ONLY when no
   * provider is configured at all — never as a fallback after a real failure,
   * which would report a bounce as a success.
   */
  private async dispatch(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    const { to, subject, html } = params;

    if (!this.resendApiKey && !this.transporter) {
      console.log(`[EmailService MOCK MODE] No email provider configured. Would send "${subject}" to ${to}`);
      return true;
    }

    const sendFn = async () => {
      if (this.resendApiKey) {
        await this.sendViaResendApi({ from: this.defaultFrom, to, subject, html });
        return true;
      }

      await this.transporter!.sendMail({ from: this.defaultFrom, to, subject, html });
      console.log(`[EmailService SMTP SUCCESS] Sent "${subject}" to ${to}`);
      return true;
    };

    return await retryWithBackoff(sendFn, { maxRetries: 3, delayMs: 1000 });
  }

  async sendReminderEmail(params: SendReminderEmailParams): Promise<boolean> {
    const {
      toEmail,
      userName,
      opportunityTitle,
      organization,
      reminderTypeLabel,
      deadlineFormatted,
      userTimezone,
      opportunityUrl,
    } = params;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${getAppUrl()}/vault-logo.png" alt="Apply Away Logo" width="48" height="48" style="margin-bottom: 8px; border-radius: 12px;" />
            <h1 style="color: #38bdf8; font-size: 24px; margin: 0;">Apply Away</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Opportunity Vault Deadline Alert</p>
          </div>

          <div style="background-color: #3b0764; border: 1px solid #7e22ce; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <h2 style="color: #e9d5ff; font-size: 16px; margin: 0;">⏰ Reminder: ${escapeHtml(reminderTypeLabel)}</h2>
          </div>

          <p style="color: #e2e8f0; font-size: 14px;">Hi ${escapeHtml(userName || "Opportunity Seeker")},</p>

          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            This is an automated reminder that your application deadline for
            <strong style="color: #ffffff;">${escapeHtml(opportunityTitle)}</strong> at
            <strong style="color: #38bdf8;">${escapeHtml(organization)}</strong> is approaching!
          </p>

          <div style="background-color: #0f172a; border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #334155;">
            <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;">APPLICATION DEADLINE (${escapeHtml(userTimezone)})</p>
            <p style="margin: 0; color: #fbbf24; font-size: 18px; font-weight: bold;">${escapeHtml(deadlineFormatted)}</p>
          </div>

          ${
            opportunityUrl
              ? `<div style="text-align: center; margin-top: 24px;">
                  <a href="${opportunityUrl}" style="background-color: #38bdf8; color: #0f172a; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">View Opportunity Details</a>
                </div>`
              : ""
          }

          <hr style="border: 0; border-top: 1px solid #334155; margin: 32px 0 16px 0;" />
          <p style="color: #64748b; font-size: 11px; text-align: center;">
            Apply Away &copy; ${new Date().getFullYear()} – Opportunity Vault & Deadline Reminder System
          </p>
        </div>
      </div>
    `;

    return await this.dispatch({
      to: toEmail,
      subject: `⏰ Deadline Alert: ${opportunityTitle} (${reminderTypeLabel})`,
      html: htmlContent,
    });
  }

  async sendWelcomeEmail(params: { toEmail: string; userName: string }): Promise<boolean> {
    const { toEmail, userName } = params;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${getAppUrl()}/vault-logo.png" alt="Apply Away Logo" width="56" height="56" style="margin-bottom: 8px; border-radius: 14px;" />
            <h1 style="color: #38bdf8; font-size: 26px; margin: 0; font-weight: bold;">Apply Away</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Welcome to Your Centralized Opportunity Vault</p>
          </div>

          <div style="background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <h2 style="color: #38bdf8; font-size: 18px; margin: 0;">🎉 Welcome Onboard, ${escapeHtml(userName || "Opportunity Seeker")}!</h2>
          </div>

          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">
            Your Apply Away account has been created successfully. You can now centralize, track, and manage all your career, scholarship, fellowship, and grant applications in one place.
          </p>

          <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 8px 0; color: #38bdf8; font-size: 13px; font-weight: bold;">🚀 What you can do next:</p>
            <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
              <li>Use <strong>AI Quick Capture</strong> to save opportunities from URLs or copied text</li>
              <li>Track deadline reminders localized to your timezone</li>
              <li>Draft essay prompts and log application reflections</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${getAppUrl()}/auth" style="background-color: #38bdf8; color: #0f172a; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Sign In to Your Vault</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #334155; margin: 32px 0 16px 0;" />
          <p style="color: #64748b; font-size: 11px; text-align: center;">
            Apply Away &copy; ${new Date().getFullYear()} – Opportunity Vault System
          </p>
        </div>
      </div>
    `;

    return await this.dispatch({
      to: toEmail,
      subject: `🎉 Welcome to Apply Away, ${userName}!`,
      html: htmlContent,
    });
  }

  /**
   * One consolidated 7am email covering every deadline milestone reached today.
   */
  async sendDigestEmail(params: SendDigestEmailParams): Promise<boolean> {
    const { toEmail, userName, userTimezone, items } = params;

    if (items.length === 0) return true;

    const sorted = [...items].sort((a, b) => a.daysLeft - b.daysLeft);
    const hasDueToday = sorted.some((item) => item.daysLeft <= 0);

    const rows = sorted
      .map((item) => {
        const bucket = Math.max(0, Math.min(item.daysLeft, 14));
        const { accent, label } = DIGEST_URGENCY[bucket] ?? {
          accent: "#38bdf8",
          label: `${item.daysLeft} Days Remaining`,
        };

        return `
          <div style="background-color: #0f172a; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid #334155; border-left: 4px solid ${accent};">
            <p style="margin: 0 0 6px 0; color: ${accent}; font-size: 11px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">${label}</p>
            <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: bold;">${escapeHtml(item.title)}</p>
            <p style="margin: 2px 0 8px 0; color: #38bdf8; font-size: 13px;">${escapeHtml(item.organization)}</p>
            <p style="margin: 0; color: #fbbf24; font-size: 13px;">${escapeHtml(item.deadlineFormatted)}</p>
            <a href="${item.url}" style="display: inline-block; margin-top: 10px; color: #38bdf8; font-size: 12px; text-decoration: underline;">View details &rarr;</a>
          </div>
        `;
      })
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${getAppUrl()}/vault-logo.png" alt="Apply Away Logo" width="48" height="48" style="margin-bottom: 8px; border-radius: 12px;" />
            <h1 style="color: #38bdf8; font-size: 24px; margin: 0;">Apply Away</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Your Morning Deadline Briefing</p>
          </div>

          <div style="background-color: #3b0764; border: 1px solid #7e22ce; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <h2 style="color: #e9d5ff; font-size: 16px; margin: 0;">
              ${hasDueToday ? "🔥" : "⏰"} ${sorted.length} deadline${sorted.length === 1 ? "" : "s"} need${sorted.length === 1 ? "s" : ""} your attention
            </h2>
          </div>

          <p style="color: #e2e8f0; font-size: 14px;">Good morning ${escapeHtml(userName || "Opportunity Seeker")},</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Here's what's coming up in your vault. All times shown in <strong style="color: #ffffff;">${escapeHtml(userTimezone)}</strong>.
          </p>

          <div style="margin: 24px 0;">
            ${rows}
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${getAppUrl()}/dashboard" style="background-color: #38bdf8; color: #0f172a; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Open Your Vault</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #334155; margin: 32px 0 16px 0;" />
          <p style="color: #64748b; font-size: 11px; text-align: center;">
            Apply Away &copy; ${new Date().getFullYear()} – Sent daily at 7:00 AM ${escapeHtml(userTimezone)}.<br />
            Change your timezone anytime in <a href="${getAppUrl()}/profile" style="color: #64748b;">Profile settings</a>.
          </p>
        </div>
      </div>
    `;

    const subject = hasDueToday
      ? `🔥 Due today: ${sorted[0].title}${sorted.length > 1 ? ` +${sorted.length - 1} more` : ""}`
      : `⏰ ${sorted.length} upcoming deadline${sorted.length === 1 ? "" : "s"} in your vault`;

    return await this.dispatch({ to: toEmail, subject, html: htmlContent });
  }
}
