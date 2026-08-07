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

  constructor() {
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
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #a855f7; font-size: 24px; margin: 0;">Apply Away</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Opportunity Vault Deadline Alert</p>
          </div>

          <div style="background-color: #3b0764; border: 1px solid #7e22ce; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <h2 style="color: #e9d5ff; font-size: 16px; margin: 0;">⏰ Reminder: ${reminderTypeLabel}</h2>
          </div>

          <p style="color: #e2e8f0; font-size: 14px;">Hi ${userName || "Opportunity Seeker"},</p>
          
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            This is an automated reminder that your application deadline for 
            <strong style="color: #ffffff;">${opportunityTitle}</strong> at 
            <strong style="color: #a855f7;">${organization}</strong> is approaching!
          </p>

          <div style="background-color: #0f172a; border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #334155;">
            <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;">APPLICATION DEADLINE (${userTimezone})</p>
            <p style="margin: 0; color: #fbbf24; font-size: 18px; font-weight: bold;">${deadlineFormatted}</p>
          </div>

          ${
            opportunityUrl
              ? `<div style="text-align: center; margin-top: 24px;">
                  <a href="${opportunityUrl}" style="background-color: #9333ea; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">View Opportunity Details</a>
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
      if (!this.transporter) {
        console.log(
          `[EmailService MOCK MODE] Reminder "${reminderTypeLabel}" sent to ${toEmail} for "${opportunityTitle}"`
        );
        return true;
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Apply Away" <reminders@applyaway.app>',
        to: toEmail,
        subject: `⏰ Deadline Alert: ${opportunityTitle} (${reminderTypeLabel})`,
        html: htmlContent,
      });

      console.log(`[EmailService SUCCESS] Email sent to ${toEmail} for "${opportunityTitle}"`);
      return true;
    };

    return await retryWithBackoff(sendFn, { maxRetries: 3, delayMs: 1000 });
  }
}
