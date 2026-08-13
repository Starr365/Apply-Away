/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const apiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || '"Apply Away" <notifications@applyaway.mmesomanzeribe.me>';
const targetEmail = "ellajoan1035@gmail.com";

console.log("=== Testing Resend Email Send ===");
console.log("From:", emailFrom);
console.log("To:", targetEmail);
console.log("Resend API Key Configured:", Boolean(apiKey));

if (!apiKey) {
  console.error("ERROR: RESEND_API_KEY is not set in environment.");
  process.exit(1);
}

async function sendTestEmail() {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [targetEmail],
      subject: "🎉 Live Test Email from applyaway.mmesomanzeribe.me!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 16px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155;">
            <h1 style="color: #38bdf8; font-size: 24px; margin: 0;">Apply Away</h1>
            <h2 style="color: #10b981; font-size: 18px; margin-top: 16px;">Domain Integration Test Successful!</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              This test email confirms that your custom domain <strong>applyaway.mmesomanzeribe.me</strong> is fully verified and connected to Resend.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
              Sent via Apply Away Email Service &bull; ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log("SUCCESS! Resend response:", data);
  } else {
    console.error("FAILED! Resend error response:", data);
  }
}

sendTestEmail().catch(console.error);
