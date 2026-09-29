import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER || 'founder@ztoitech.com',
    pass: process.env.SMTP_PASS || 'hdtamaqpmfwhyghg',
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || '"Altruisty Innovation" <founder@ztoitech.com>';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html,
      attachments,
    });
    console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// 1. Email Verification OTP
export async function sendVerificationEmail(email: string, name: string, otp: string) {
  const subject = `Your Verification Code for Altruisty Internship Platform - ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1b449c 0%, #0284c7 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
        .body { padding: 32px 24px; }
        .otp-box { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
        .otp { font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #1b449c; margin: 0; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>ALTRUISTY INNOVATION</h1>
          <p>Registration & Email Verification</p>
        </div>
        <div class="body">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for registering for the Altruisty Innovation Internship Program and successfully completing your initial registration payment.</p>
          <p>Please enter the following 6-digit verification code to verify your email address and activate your student portal:</p>
          
          <div class="otp-box">
            <div class="otp">${otp}</div>
            <p style="margin: 8px 0 0; font-size: 13px; color: #0284c7;">Valid for 15 minutes</p>
          </div>

          <p style="font-size: 13px; color: #64748b;">If you entered an incorrect email address during registration, you can use the "Change Email" button on the verification page to update it.</p>
        </div>
        <div class="footer">
          Altruisty Innovation Pvt Ltd<br>
          Need help? Contact support at altruistybusiness@gmail.com | +91 8667839838
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: email, subject, html });
}

// 2. Online Class Notification with Google Meet Link
export async function sendOnlineClassEmail({
  to,
  studentName,
  batchName,
  classTitle,
  date,
  startTime,
  endTime,
  gmeetLink,
}: {
  to: string;
  studentName: string;
  batchName: string;
  classTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  gmeetLink: string;
}) {
  const subject = `Live Class Scheduled: ${classTitle} - Google Meet Link`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1b449c 0%, #0284c7 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
        .body { padding: 32px 24px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; }
        .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .details-table td.label { font-weight: 600; color: #475569; width: 35%; }
        .button-wrap { text-align: center; margin: 30px 0 10px; }
        .btn { background: #0284c7; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size:22px;">Altruisty Innovation</h1>
          <p style="margin:6px 0 0; opacity:0.9;">Online Class Notification</p>
        </div>
        <div class="body">
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>A new live online session has been scheduled for your batch <strong>${batchName}</strong>.</p>
          
          <table class="details-table">
            <tr>
              <td class="label">Session Title</td>
              <td><strong>${classTitle}</strong></td>
            </tr>
            <tr>
              <td class="label">Date</td>
              <td>${date}</td>
            </tr>
            <tr>
              <td class="label">Timing</td>
              <td>${startTime} to ${endTime}</td>
            </tr>
            <tr>
              <td class="label">Mode</td>
              <td><span style="color:#0284c7; font-weight:bold;">Online (Google Meet)</span></td>
            </tr>
          </table>

          <div class="button-wrap">
            <a href="${gmeetLink}" target="_blank" class="btn">🚀 Join Google Meet Class</a>
          </div>
          <p style="text-align:center; font-size:13px; color:#64748b; margin-top:12px;">Link: <a href="${gmeetLink}">${gmeetLink}</a></p>
          
          <p style="font-size:13px; color:#64748b; margin-top:24px;">Please join 5 minutes prior to the start time with a stable internet connection.</p>
        </div>
        <div class="footer">
          Altruisty Innovation Pvt Ltd<br>
          Questions? Contact mentor or email altruistybusiness@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to, subject, html });
}

// 3. Offline Class / Office Timings Notification
export async function sendOfflineScheduleEmail({
  to,
  studentName,
  batchName,
  classTitle,
  date,
  startTime,
  endTime,
  venueInstructions,
}: {
  to: string;
  studentName: string;
  batchName: string;
  classTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  venueInstructions?: string;
}) {
  const subject = `Offline Internship Session: ${classTitle} - Reporting Timings`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1b449c 0%, #0284c7 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
        .body { padding: 32px 24px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; }
        .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .details-table td.label { font-weight: 600; color: #475569; width: 35%; }
        .alert-box { background: #eff6ff; border-left: 4px solid #1b449c; padding: 14px 16px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size:22px;">Altruisty Innovation</h1>
          <p style="margin:6px 0 0; opacity:0.9;">Offline Training & Office Reporting Schedule</p>
        </div>
        <div class="body">
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>Here is your upcoming offline training schedule for batch <strong>${batchName}</strong>:</p>
          
          <table class="details-table">
            <tr>
              <td class="label">Session Topic</td>
              <td><strong>${classTitle}</strong></td>
            </tr>
            <tr>
              <td class="label">Date</td>
              <td>${date}</td>
            </tr>
            <tr>
              <td class="label">Reporting Timings</td>
              <td><strong>${startTime} - ${endTime}</strong></td>
            </tr>
            <tr>
              <td class="label">Training Venue</td>
              <td>Authorized Training Center (Instructions below)</td>
            </tr>
          </table>

          <div class="alert-box">
            <strong>Venue Instructions:</strong><br>
            ${venueInstructions || 'Please bring your laptop and charger. Please report to the reception 10 minutes prior to scheduled start time.'}
          </div>
        </div>
        <div class="footer">
          Altruisty Innovation Pvt Ltd<br>
          Contact: +91 8667839838 | altruistybusiness@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendOfferLetterEmail({
  to,
  candidateName,
  domain,
  startDate,
  duration,
  regId,
  pdfBuffer,
}: {
  to: string;
  candidateName: string;
  domain: string;
  startDate: string;
  duration: string;
  regId: string;
  pdfBuffer?: Buffer;
}) {
  const subject = `Internship Offer Letter | ${candidateName}`;
  const preheaderText = `Please find attached your formal Internship Offer Letter from Altruisty Innovation Pvt. Ltd.`;
  const sanitizedName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const attachmentFilename = `Altruisty_Offer_Letter_${sanitizedName}.pdf`;

  const textBody = `Dear ${candidateName},

We are pleased to extend an offer for an internship position at Altruisty Innovation Pvt. Ltd. in the domain of ${domain}.

Your formal offer letter has been generated and is attached to this email. It outlines the scope of work, duration (${duration}), commencement date (${startDate}), and onboarding requirements.

Registration / Credential ID: ${regId}

Next Steps:
1. Review the enclosed terms and program timeline.
2. Acknowledge receipt by replying to this email at your earliest convenience.
3. Keep the attached PDF safe for your records. Our team will reach out with onboarding instructions closer to your start date.

Sincerely,
People Operations Team
Altruisty Innovation Pvt. Ltd.
https://altruistyinnovation.com`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="display: none; font-size: 1px; color: #f9fafb; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheaderText}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: #111827; text-transform: uppercase;">
                      ALTRUISTY INNOVATION
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; font-weight: 500; color: #6b7280; background-color: #f3f4f6; padding: 4px 10px; border-radius: 4px;">
                      Official Document
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #1f2937;">Dear <strong>${candidateName}</strong>,</p>
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #374151;">
                We are thrilled to extend an offer for an internship position at <strong>Altruisty Innovation Pvt. Ltd.</strong> in the domain of <strong>${domain}</strong>.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #374151;">
                Your formal offer letter is attached to this email as a PDF. It confirms your registration, program timeline, commencement date (<strong>${startDate}</strong>), and duration (<strong>${duration}</strong>).
              </p>

              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <span style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Student Registration Credential</span>
                <span style="font-family: monospace; font-size: 18px; font-weight: 800; color: #15803d;">REG:${regId}</span>
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px; font-size: 13.5px; color: #334155; line-height: 22px;">
                    <strong style="color: #0f172a; display: block; margin-bottom: 8px; font-size: 13px; letter-spacing: 0.02em; text-transform: uppercase;">Next Steps</strong>
                    <div style="margin-bottom: 6px;">
                      <span style="font-weight: 600; color: #0f172a;">1. Review:</span> Review the attached official Offer Letter document for complete details.
                    </div>
                    <div style="margin-bottom: 6px;">
                      <span style="font-weight: 600; color: #0f172a;">2. Acknowledge:</span> Confirm receipt of this letter by replying directly to this thread.
                    </div>
                    <div>
                      <span style="font-weight: 600; color: #0f172a;">3. Onboarding:</span> We will share your Google Meet calendar invites and batch schedule shortly.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Signature Block -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #f3f4f6; padding-top: 24px; margin-top: 8px;">
                <tr>
                  <td style="font-size: 14px; line-height: 20px; color: #4b5563;">
                    <strong style="color: #111827;">People Operations Team</strong><br>
                    Altruisty Innovation Pvt. Ltd.<br>
                    <a href="https://altruistyinnovation.com" style="color: #2563eb; text-decoration: none; font-size: 13px;">altruistyinnovation.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Security & Legal Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 12px; color: #9ca3af; line-height: 18px; padding: 0 16px;">
              This is a confidential communication intended solely for ${to}.<br>
              © ${new Date().getFullYear()} Altruisty Innovation Pvt. Ltd. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const attachments: EmailAttachment[] = [];
  if (pdfBuffer) {
    attachments.push({
      filename: attachmentFilename,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });
  }

  return sendEmail({
    to,
    subject,
    text: textBody,
    html,
    attachments,
  });
}

// 4. Certificate Issued Email
export async function sendCertificateEmail({
  to,
  studentName,
  trackName,
  certificateId,
  verificationUrl,
  pdfBuffer,
}: {
  to: string;
  studentName: string;
  trackName: string;
  certificateId: string;
  verificationUrl: string;
  pdfBuffer?: Buffer;
}) {
  const subject = `Congratulations! Your Altruisty Internship Certificate is Ready (${certificateId})`;
  const sanitizedName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const attachmentFilename = `Altruisty_Completion_Certificate_${sanitizedName}.pdf`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1b449c 0%, #0284c7 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .body { padding: 32px 24px; }
        .cert-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
        .cert-id { font-size: 20px; font-weight: 800; color: #166534; letter-spacing: 1px; }
        .button-wrap { text-align: center; margin: 24px 0 10px; }
        .btn { background: #1b449c; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size:24px;">🎓 Altruisty Innovation</h1>
          <p style="margin:6px 0 0; opacity:0.9;">Certificate of Completion Issued</p>
        </div>
        <div class="body">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Congratulations on successfully completing your internship in <strong>${trackName}</strong> and settling your final balance fee!</p>
          
          <div class="cert-card">
            <p style="margin:0 0 6px; font-size:13px; color:#15803d; text-transform:uppercase; font-weight:bold;">Certificate Credential ID</p>
            <div class="cert-id">${certificateId}</div>
          </div>

          <p>Your official verifiable certificate has been issued and is attached as a PDF to this email. It is also available for viewing, downloading, and sharing with recruiters via your student dashboard.</p>

          <div class="button-wrap">
            <a href="${verificationUrl}" target="_blank" class="btn">View & Verify Online</a>
          </div>

          <p style="font-size:13px; color:#64748b; margin-top:20px; text-align:center;">
            Public Verification URL: <br><a href="${verificationUrl}">${verificationUrl}</a>
          </p>
        </div>
        <div class="footer">
          Altruisty Innovation Pvt Ltd<br>
          We wish you the very best in your tech career!
        </div>
      </div>
    </body>
    </html>
  `;

  const attachments: EmailAttachment[] = [];
  if (pdfBuffer) {
    attachments.push({
      filename: attachmentFilename,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });
  }

  return sendEmail({ to, subject, html, attachments });
}

// 5. Referral Bonus Notification
export async function sendReferralBonusEmail({
  to,
  studentName,
  refereeName,
  discountAmount,
}: {
  to: string;
  studentName: string;
  refereeName: string;
  discountAmount: number;
}) {
  const subject = `🎉 You earned a ₹${discountAmount} Referral Discount!`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1b449c 0%, #0284c7 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
        .body { padding: 32px 24px; }
        .reward-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; text-align: center; padding: 18px; margin: 20px 0; }
        .amount { font-size: 28px; font-weight: 800; color: #854d0e; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size:22px;">Altruisty Innovation</h1>
          <p style="margin:6px 0 0; opacity:0.9;">Referral Reward Earned</p>
        </div>
        <div class="body">
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>Great news! Your friend <strong>${refereeName}</strong> has just enrolled and completed their initial payment using your referral code.</p>
          
          <div class="reward-box">
            <p style="margin:0; font-size:13px; color:#a16207; font-weight:600;">Referral Discount Applied</p>
            <div class="amount">₹${discountAmount}</div>
          </div>

          <p>This discount has been deducted from your remaining balance fee payable for your certificate. Keep inviting your friends to earn even more deductions!</p>
        </div>
        <div class="footer">
          Altruisty Innovation Pvt Ltd
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to, subject, html });
}
