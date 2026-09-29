import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const data = await req.formData()
    const file = data.get('pdf')
    const candidateEmail = data.get('candidateEmail')
    const candidateName = (data.get('candidateName') || 'Candidate').trim()
    const documentType = data.get('documentType') || 'offer'

    if (!file || !candidateEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing PDF or recipient email address.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const fromName = process.env.SMTP_FROM_NAME || 'Altruisty Innovation'
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
    const isCompletion = documentType === 'completion'

    const subject = isCompletion
      ? `Internship Completion Certificate | ${candidateName}`
      : `Internship Offer Letter | ${candidateName}`

    const preheaderText = isCompletion
      ? `Please find attached your official Internship Completion Certificate from Altruisty Innovation.`
      : `Please find attached your formal Internship Offer Letter from Altruisty Innovation.`

    const sanitizedName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_')
    const attachmentFilename = isCompletion
      ? `Altruisty_Completion_Certificate_${sanitizedName}.pdf`
      : `Altruisty_Offer_Letter_${sanitizedName}.pdf`

    const textBody = isCompletion
      ? `Dear ${candidateName},

We are pleased to formally present your Internship Completion Certificate with Altruisty Innovation Pvt. Ltd.

Your certificate has been attached to this email as a PDF document. It serves as an official record of your tenure, core responsibilities, and successful completion of your internship program.

We appreciate the dedication and initiative you demonstrated during your time with our team. We wish you continued success in your academic and professional pursuits.

Should you require future background verification or professional recommendations, feel free to contact our department.

Sincerely,
People Operations Team
Altruisty Innovation Pvt. Ltd.
https://altruistyinnovation.com`
      : `Dear ${candidateName},

We are pleased to extend an offer for an internship position at Altruisty Innovation Pvt. Ltd.

Your formal offer letter is attached to this email. It outlines the scope of work, duration, compensation details, and onboarding requirements.

Next Steps:
1. Review the enclosed terms and program timeline.
2. Acknowledge receipt by replying to this email at your earliest convenience.
3. Keep the attached PDF safe for your records. Our team will reach out with onboarding instructions closer to your start date.

We look forward to welcoming you to the team.

Sincerely,
People Operations Team
Altruisty Innovation Pvt. Ltd.
https://altruistyinnovation.com`

    const mainCardContent = isCompletion
      ? `
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #1f2937;">Dear <strong>${candidateName}</strong>,</p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #374151;">
          We are pleased to formally present your <strong>Internship Completion Certificate</strong> with Altruisty Innovation Pvt. Ltd.
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #374151;">
          Your official certificate is attached to this email as a PDF document. It serves as formal verification of your tenure, core competencies demonstrated, and successful completion of the program.
        </p>
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #374151;">
          We sincerely appreciate the focus, diligence, and professionalism you brought to our engineering and product initiatives. We wish you the very best in your academic and professional journey.
        </p>
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 14px 18px; font-size: 13px; color: #475569; line-height: 20px;">
              <strong>Document:</strong> Official Completion Certificate (PDF)<br>
              <strong>Verification:</strong> Reply directly to this email for any employment verification requests.
            </td>
          </tr>
        </table>
      `
      : `
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #1f2937;">Dear <strong>${candidateName}</strong>,</p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #374151;">
          We are pleased to extend an offer for an internship position at <strong>Altruisty Innovation Pvt. Ltd.</strong> Following our evaluation, we were impressed by your background and believe you will make a valuable addition to our team.
        </p>
        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #374151;">
          Your formal offer letter is attached to this email. It outlines the scope of work, duration, compensation details, and onboarding requirements.
        </p>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 18px 20px; font-size: 13.5px; color: #334155; line-height: 22px;">
              <strong style="color: #0f172a; display: block; margin-bottom: 8px; font-size: 13px; letter-spacing: 0.02em; text-transform: uppercase;">Next Steps</strong>
              <div style="margin-bottom: 6px;">
                <span style="font-weight: 600; color: #0f172a;">1. Review:</span> Review the attached document for complete program details and guidelines.
              </div>
              <div style="margin-bottom: 6px;">
                <span style="font-weight: 600; color: #0f172a;">2. Acknowledge:</span> Confirm receipt of this letter by replying directly to this thread.
              </div>
              <div>
                <span style="font-weight: 600; color: #0f172a;">3. Onboarding:</span> We will share your first-day onboarding schedule closer to your joining date.
              </div>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #64748b;">
          If you have any questions or require clarifications prior to signing, please respond to this thread.
        </p>
      `

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;">
  
  <!-- Hidden Preheader for Inbox Previews -->
  <div style="display: none; font-size: 1px; color: #f9fafb; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheaderText}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; padding: 40px 16px;">
    <tr>
      <td align="center">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          
          <!-- Minimal Pure White Brand Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: #111827; text-transform: uppercase;">
                      Altruisty Innovation
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
              ${mainCardContent}

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
              This is a confidential communication intended solely for ${candidateEmail}.<br>
              © ${new Date().getFullYear()} Altruisty Innovation Pvt. Ltd. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: fromEmail,
      to: candidateEmail,
      subject,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: attachmentFilename,
          content: buffer,
          contentType: 'application/pdf',
        },
      ],
      headers: {
        'X-Entity-Ref-ID': `${Date.now()}-${candidateEmail}`,
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
      },
    })

    return NextResponse.json({ success: true, message: 'Email dispatched successfully.' })
  } catch (err) {
    console.error('SMTP error:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Email sending failed' },
      { status: 500 }
    )
  }
}