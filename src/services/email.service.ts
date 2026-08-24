import nodemailer from "nodemailer";
import { retryWithBackoff } from "@/lib/retry";
import { getAppUrl } from "@/lib/app-url";
import { emailTheme as t, emailRadius } from "@/lib/email-theme";

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

/** Human label per remaining-days bucket. Urgency is conveyed by wording. */
const DAYS_LEFT_LABEL: Record<number, string> = {
  0: "Due Today",
  1: "1 Day Remaining",
  3: "3 Days Remaining",
  7: "7 Days Remaining",
  14: "14 Days Remaining",
};

/** A deadline this close is styled with the destructive token instead of primary. */
const URGENT_DAYS_THRESHOLD = 1;

/** Escape user-supplied values before interpolating them into email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* -------------------------------------------------------------------------- */
/*  Shared layout partials                                                     */
/*                                                                            */
/*  Every email is built from these, so the welcome, reminder, and digest      */
/*  messages stay visually identical. Colours come only from emailTheme,       */
/*  which mirrors the tokens in globals.css.                                   */
/* -------------------------------------------------------------------------- */

const FONT_STACK = "Arial, Helvetica, sans-serif";

/** Outer page + centered card. `body` is the card's inner HTML. */
function shell(body: string): string {
  return `
  <div style="font-family: ${FONT_STACK}; background-color: ${t.background}; color: ${t.foreground}; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: ${t.card}; border-radius: ${emailRadius}; padding: 16px; border: 1px solid ${t.border};">
      ${body}
    </div>
  </div>`;
}

/** Logo, wordmark, and a short subtitle. */
function header(subtitle: string): string {
  return `
      <div style="margin-bottom: 28px;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align: middle; padding-right: 12px;">
              <img src="${getAppUrl()}/vault-logo.png" alt="Apply Away" width="36" height="36" style="border-radius: ${emailRadius}; display: block;" />
            </td>
            <td style="vertical-align: middle;">
              <div style="color: ${t.foreground}; font-size: 20px; font-weight: bold; letter-spacing: -0.2px; line-height: 1;">Apply Away</div>
              <div style="color: ${t.mutedForeground}; font-size: 13px; margin-top: 4px; line-height: 1.2;">${escapeHtml(subtitle)}</div>
            </td>
          </tr>
        </table>
      </div>`;
}

/** Primary call-to-action button. */
function cta(href: string, label: string): string {
  return `
      <div style="text-align: center; margin-top: 28px;">
        <a href="${href}" style="background-color: ${t.primary}; color: ${t.primaryForeground}; padding: 12px 26px; border-radius: ${emailRadius}; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">${escapeHtml(label)}</a>
      </div>`;
}

/** Divider plus fine print. */
function footer(note: string): string {
  return `
      <hr style="border: 0; border-top: 1px solid ${t.border}; margin: 32px 0 16px 0;" />
      <div style="color: ${t.mutedForeground}; font-size: 11px; text-align: center; line-height: 1.6;">
        Apply Away &copy; ${new Date().getFullYear()} &middot; Opportunity Vault<br />${note}
      </div>`;
}

/** Inset panel used for deadline details and tip lists. */
function panel(inner: string, accent: string = t.border): string {
  return `
      <div style="background-color: ${t.background}; border: 1px solid ${t.border}; border-left: 3px solid ${accent}; border-radius: ${emailRadius}; padding: 16px; margin: 20px 0;">
        ${inner}
      </div>`;
}

/** Small uppercase status pill. */
function badge(label: string, urgent: boolean): string {
  const bg = urgent ? t.destructive : t.secondary;
  const fg = urgent ? t.destructiveForeground : t.foreground;
  return `<span style="display: inline-block; background-color: ${bg}; color: ${fg}; font-size: 10px; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase; padding: 4px 10px; border-radius: 999px;">${escapeHtml(label)}</span>`;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private resendApiKey: string | null = null;
  private defaultFrom: string;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || null;
    // NOTE: this is the Resend *verified sending domain*, which is deliberately
    // separate from the app's URL (apply-away.vercel.app). A vercel.app
    // subdomain cannot be DNS-verified for sending, so this must not be
    // "updated" to match the site origin.
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

    const htmlContent = shell(`
      ${header("Deadline Alert")}

      <div style="margin-bottom: 20px;">${badge(reminderTypeLabel, true)}</div>

      <p style="color: ${t.foreground}; font-size: 14px; margin: 0 0 12px 0;">Hi ${escapeHtml(userName || "Opportunity Seeker")},</p>

      <p style="color: ${t.mutedForeground}; font-size: 14px; line-height: 1.6; margin: 0;">
        Your application deadline for
        <strong style="color: ${t.foreground};">${escapeHtml(opportunityTitle)}</strong> at
        <strong style="color: ${t.foreground};">${escapeHtml(organization)}</strong> is approaching.
      </p>

      ${panel(
      `<div style="color: ${t.mutedForeground}; font-size: 11px; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px;">Deadline &middot; ${escapeHtml(userTimezone)}</div>
         <div style="color: ${t.foreground}; font-size: 17px; font-weight: bold;">${escapeHtml(deadlineFormatted)}</div>`,
      t.destructive
    )}

      ${opportunityUrl ? cta(opportunityUrl, "View Opportunity") : ""}

      ${footer("You receive these because you have an upcoming deadline saved in your vault.")}
    `);

    return await this.dispatch({
      to: toEmail,
      subject: `Deadline Alert: ${opportunityTitle} (${reminderTypeLabel})`,
      html: htmlContent,
    });
  }

  async sendWelcomeEmail(params: { toEmail: string; userName: string }): Promise<boolean> {
    const { toEmail, userName } = params;

    const htmlContent = shell(`
      ${header("Welcome to your Opportunity Vault")}

      <div style="margin-bottom: 20px;">${badge("Account Created", false)}</div>

      <p style="color: ${t.foreground}; font-size: 14px; margin: 0 0 12px 0;">Hi ${escapeHtml(userName || "Opportunity Seeker")},</p>

      <p style="color: ${t.mutedForeground}; font-size: 14px; line-height: 1.6; margin: 0;">
        Your account is ready. You can now centralize, track, and manage every
        scholarship, fellowship, grant, and career application in one place.
      </p>

      ${panel(
      `<div style="color: ${t.foreground}; font-size: 13px; font-weight: bold; margin-bottom: 10px;">What you can do next</div>
         <ul style="margin: 0; padding-left: 18px; color: ${t.mutedForeground}; font-size: 13px; line-height: 1.8;">
           <li>Use <strong style="color: ${t.foreground};">AI Quick Capture</strong> to save opportunities from a URL or pasted text</li>
           <li>Get deadline reminders at 7:00 AM in your own timezone</li>
           <li>Draft essay responses and log application reflections</li>
         </ul>`,
      t.primary
    )}

      ${cta(`${getAppUrl()}/auth`, "Sign In to Your Vault")}

      ${footer(`Set your timezone anytime in <a href="${getAppUrl()}/profile" style="color: ${t.mutedForeground};">Profile settings</a>.`)}
    `);

    return await this.dispatch({
      to: toEmail,
      subject: `Welcome to Apply Away, ${userName}`,
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
        const urgent = item.daysLeft <= URGENT_DAYS_THRESHOLD;
        const accent = urgent ? t.destructive : t.primary;
        const label =
          DAYS_LEFT_LABEL[Math.max(0, item.daysLeft)] ?? `${item.daysLeft} Days Remaining`;

        return `
      <div style="background-color: ${t.background}; border: 1px solid ${t.border}; border-left: 3px solid ${accent}; border-radius: ${emailRadius}; padding: 16px; margin-bottom: 12px;">
        <div style="margin-bottom: 8px;">${badge(label, urgent)}</div>
        <div style="color: ${t.foreground}; font-size: 15px; font-weight: bold;">${escapeHtml(item.title)}</div>
        <div style="color: ${t.mutedForeground}; font-size: 13px; margin-top: 2px;">${escapeHtml(item.organization)}</div>
        <div style="color: ${t.mutedForeground}; font-size: 13px; margin-top: 8px;">${escapeHtml(item.deadlineFormatted)}</div>
        <a href="${item.url}" style="display: inline-block; margin-top: 10px; color: ${t.primary}; font-size: 12px; font-weight: bold; text-decoration: none;">View details &rarr;</a>
      </div>`;
      })
      .join("");

    const htmlContent = shell(`
      ${header("Your morning deadline briefing")}

      <div style="margin-bottom: 20px;">
        ${badge(
      `${sorted.length} deadline${sorted.length === 1 ? "" : "s"}`,
      hasDueToday
    )}
      </div>

      <p style="color: ${t.foreground}; font-size: 14px; margin: 0 0 12px 0;">Good morning ${escapeHtml(userName || "Opportunity Seeker")},</p>

      <p style="color: ${t.mutedForeground}; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
        Here's what's coming up in your vault. All times shown in
        <strong style="color: ${t.foreground};">${escapeHtml(userTimezone)}</strong>.
      </p>

      ${rows}

      ${cta(`${getAppUrl()}/dashboard`, "Open Your Vault")}

      ${footer(
      `Sent daily at 7:00 AM ${escapeHtml(userTimezone)}. Change your timezone in <a href="${getAppUrl()}/profile" style="color: ${t.mutedForeground};">Profile settings</a>.`
    )}
    `);

    const subject = hasDueToday
      ? `Due today: ${sorted[0].title}${sorted.length > 1 ? ` and ${sorted.length - 1} more` : ""}`
      : `${sorted.length} upcoming deadline${sorted.length === 1 ? "" : "s"} in your vault`;

    return await this.dispatch({ to: toEmail, subject, html: htmlContent });
  }

  async sendPasswordResetEmail(params: { toEmail: string; code: string }): Promise<boolean> {
    const { toEmail, code } = params;

    const htmlContent = shell(`
      ${header("Reset Your Password")}

      <div style="margin-bottom: 20px;">${badge("Verification Code", true)}</div>

      <p style="color: ${t.foreground}; font-size: 14px; margin: 0 0 12px 0;">Hello,</p>

      <p style="color: ${t.mutedForeground}; font-size: 14px; line-height: 1.6; margin: 0;">
        We received a request to reset your password. Use the verification code below to set a new password. This code will expire in 15 minutes.
      </p>

      ${panel(
      `<div style="color: ${t.mutedForeground}; font-size: 11px; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px;">Your Reset Code</div>
         <div style="color: ${t.foreground}; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${escapeHtml(code)}</div>`,
      t.primary
    )}

      ${footer("If you did not request a password reset, please ignore this email.")}
    `);

    return await this.dispatch({
      to: toEmail,
      subject: `Apply Away Password Reset Verification Code: ${code}`,
      html: htmlContent,
    });
  }
}
