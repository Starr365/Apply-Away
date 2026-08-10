import nodemailer from "nodemailer";
import { retryWithBackoff } from "@/lib/retry";

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

  private async sendViaResendApi(params: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!this.resendApiKey) return false;

    try {
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

      const data = await response.json();

      if (response.ok) {
        console.log(`[EmailService RESEND API SUCCESS] Sent email to ${params.to}, id: ${data.id}`);
        return true;
      } else {
        console.error(`[EmailService RESEND API ERROR]`, data);
        return false;
      }
    } catch (err) {
      console.error("[EmailService RESEND API EXCEPTION]", err);
      return false;
    }
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
            <img src="https://applyaway.mmesomanzeribe.me/vault-logo.png" alt="Apply Away Logo" width="48" height="48" style="margin-bottom: 8px; border-radius: 12px;" />
            <h1 style="color: #38bdf8; font-size: 24px; margin: 0;">Apply Away</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Opportunity Vault Deadline Alert</p>
          </div>

          <div style="background-color: #3b0764; border: 1px solid #7e22ce; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <h2 style="color: #e9d5ff; font-size: 16px; margin: 0;">⏰ Reminder: ${reminderTypeLabel}</h2>
          </div>

          <p style="color: #e2e8f0; font-size: 14px;">Hi ${userName || "Opportunity Seeker"},</p>
          
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            This is an automated reminder that your application deadline for 
            <strong style="color: #ffffff;">${opportunityTitle}</strong> at 
            <strong style="color: #38bdf8;">${organization}</strong> is approaching!
          </p>

          <div style="background-color: #0f172a; border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #334155;">
            <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;">APPLICATION DEADLINE (${userTimezone})</p>
            <p style="margin: 0; color: #fbbf24; font-size: 18px; font-weight: bold;">${deadlineFormatted}</p>
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

    const sendFn = async () => {
      const from = this.defaultFrom;

      if (this.resendApiKey) {
        const ok = await this.sendViaResendApi({
          from,
          to: toEmail,
          subject: `⏰ Deadline Alert: ${opportunityTitle} (${reminderTypeLabel})`,
          html: htmlContent,
        });
        if (ok) return true;
      }

      if (this.transporter) {
        await this.transporter.sendMail({
          from,
          to: toEmail,
          subject: `⏰ Deadline Alert: ${opportunityTitle} (${reminderTypeLabel})`,
          html: htmlContent,
        });
        console.log(`[EmailService SMTP SUCCESS] Email sent to ${toEmail} for "${opportunityTitle}"`);
        return true;
      }

      console.log(
        `[EmailService MOCK MODE] Reminder "${reminderTypeLabel}" sent to ${toEmail} for "${opportunityTitle}"`
      );
      return true;
    };

    return await retryWithBackoff(sendFn, { maxRetries: 3, delayMs: 1000 });
  }

  async sendWelcomeEmail(params: { toEmail: string; userName: string }): Promise<boolean> {
    const { toEmail, userName } = params;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://applyaway.mmesomanzeribe.me/vault-logo.png" alt="Apply Away Logo" width="56" height="56" style="margin-bottom: 8px; border-radius: 14px;" />
            <h1 style="color: #38bdf8; font-size: 26px; margin: 0; font-weight: bold;">Apply Away</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Welcome to Your Centralized Opportunity Vault</p>
          </div>

          <div style="background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <h2 style="color: #38bdf8; font-size: 18px; margin: 0;">🎉 Welcome Onboard, ${userName || "Opportunity Seeker"}!</h2>
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
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth" style="background-color: #38bdf8; color: #0f172a; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Sign In to Your Vault</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #334155; margin: 32px 0 16px 0;" />
          <p style="color: #64748b; font-size: 11px; text-align: center;">
            Apply Away &copy; ${new Date().getFullYear()} – Opportunity Vault System
          </p>
        </div>
      </div>
    `;

    const sendFn = async () => {
      const from = this.defaultFrom;

      if (this.resendApiKey) {
        const ok = await this.sendViaResendApi({
          from,
          to: toEmail,
          subject: `🎉 Welcome to Apply Away, ${userName}!`,
          html: htmlContent,
        });
        if (ok) return true;
      }

      if (this.transporter) {
        await this.transporter.sendMail({
          from,
          to: toEmail,
          subject: `🎉 Welcome to Apply Away, ${userName}!`,
          html: htmlContent,
        });
        console.log(`[EmailService SMTP SUCCESS] Welcome email sent to ${toEmail}`);
        return true;
      }

      console.log(
        `[EmailService MOCK MODE] Welcome email sent to ${toEmail} for "${userName}"`
      );
      return true;
    };

    return await retryWithBackoff(sendFn, { maxRetries: 3, delayMs: 1000 });
  }
}
