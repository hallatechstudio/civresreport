import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
} = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
  console.warn("Email configuration is missing. Email notifications will not be sent.");
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: EMAIL_SECURE === "true",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export function getEmailHtml(reportId: string, category: string, area: string, state: string, description: string) {
  const trackingUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/track/${reportId}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Report Submitted - Civres</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; padding: 32px 40px; text-align: center;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #ffffff; border-radius: 10px; margin-bottom: 12px;">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 5L6 9H2V15L6 19H20V9L15 5H11Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6024 15.54 15.54" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 15.54L11 17.54" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                        <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Civres</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #000000; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Report Submitted Successfully</h2>
                  <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                    Thank you for reporting this issue. Your report has been received and is now visible to the relevant authority. We will keep you updated on its progress.
                  </p>
                  
                  <!-- Report Details -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 16px 20px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Report ID</p>
                        <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #000000; letter-spacing: 2px;">${reportId}</p>
                        
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Category</p>
                        <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333;">${category}</p>
                        
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                        <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333;">${area}, ${state}</p>
                        
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Description</p>
                        <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">${description.length > 200 ? description.substring(0, 200) + "..." : description}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <a href="${trackingUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 14px;">Track Your Report</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 0;">
                    You can track the status of your report anytime using your Report ID. Your issue is documented and will be followed up until it is resolved.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 24px 40px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0; font-size: 13px; color: #888888;">
                    &copy; ${new Date().getFullYear()} Civres. All rights reserved.
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: #888888;">
                    Built to help Nigerians speak up and get things done.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getEmailText(reportId: string, category: string, area: string, state: string, trackingUrl: string) {
  return `
Report Submitted Successfully - Civres

Thank you for reporting this issue. Your report has been received and is now visible to the relevant authority.

Report ID: ${reportId}
Category: ${category}
Location: ${area}, ${state}

You can track the status of your report anytime using your Report ID.
Track here: ${trackingUrl}

Your issue is documented and will be followed up until it is resolved.

© ${new Date().getFullYear()} Civres. All rights reserved.
  `.trim();
}

export async function sendReportConfirmationEmail(to: string, report: { id: string; categoryName: string; area: string; state: string; description: string }) {
  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    console.warn("Email not configured. Skipping email send.");
    return;
  }

  const trackingUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/track/${report.id}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: `Report Submitted - ${report.categoryName} | Civres`,
    text: getEmailText(report.id, report.categoryName, report.area, report.state, trackingUrl),
    html: getEmailHtml(report.id, report.categoryName, report.area, report.state, report.description),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
