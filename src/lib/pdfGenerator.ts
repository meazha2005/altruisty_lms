import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export interface OfferLetterData {
  candidateName: string;
  domain: string;
  startDate: string;
  duration: string;
  date: string;
  regId: string;
}

export interface CompletionCertificateData {
  candidateName: string;
  domain: string;
  startDate: string;
  endDate: string;
  duration: string;
  date: string;
  regno: string;
  certificateId: string;
  verificationUrl?: string;
}

/**
 * Generates an official Offer Letter PDF matching certificate_lms design.
 */
export async function generateOfferLetterPdfBuffer(data: OfferLetterData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [794, 1123],
    compress: true,
  });

  const templatePath = path.join(process.cwd(), 'public', 'template.png');
  const templateBase64 = fs.readFileSync(templatePath).toString('base64');
  const templateImgData = `data:image/png;base64,${templateBase64}`;

  // Draw background template
  doc.addImage(templateImgData, 'PNG', 0, 0, 794, 1123, undefined, 'FAST');

  // Set font
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // 1. DATE (top: 300px, right: 510px container, aligned right at x=737)
  doc.setFontSize(13.5);
  doc.text(`DATE: ${data.date}`, 737, 320, { align: 'right' });

  // 2. Salutation (top: 370px, left: 50px)
  doc.setFontSize(14.5);
  doc.text(`Dear ${data.candidateName},`, 50, 390);

  // 3. Body paragraphs (top: 430px, left: 50px, width: 690px, line-height 30px)
  doc.setFontSize(13.5);
  const p1 = `We are thrilled to inform you that you have been selected for internship in the Altruisty in the domain of ${data.domain}.`;
  doc.text(doc.splitTextToSize(p1, 690), 50, 440);

  const p2 = `The internship will commence on ${data.startDate} and will last for a duration of ${data.duration}. During this time, you will have the opportunity to gain practical experience, learn from industry experts, and collaborate with a team of domain professionals.`;
  doc.text(doc.splitTextToSize(p2, 690), 50, 485);

  const p3 = `We are confident that your skills and dedication will contribute greatly to the success of our program, and we look forward to seeing the valuable contributions you will make.`;
  doc.text(doc.splitTextToSize(p3, 690), 50, 560);

  // 4. REG ID (bottom: 170px, right: 84px => x=710, y=953)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`REG:${data.regId}`, 710, 953, { align: 'right' });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

/**
 * Generates an official Completion Certificate PDF matching certificate_lms design + verification QR.
 */
export async function generateCompletionCertificatePdfBuffer(data: CompletionCertificateData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [794, 1123],
    compress: true,
  });

  const bgPath = path.join(process.cwd(), 'public', 'completion_bg.jpg');
  const bgBase64 = fs.readFileSync(bgPath).toString('base64');
  const bgImgData = `data:image/jpeg;base64,${bgBase64}`;

  // Draw background image
  doc.addImage(bgImgData, 'JPEG', 0, 0, 794, 1123, undefined, 'FAST');

  // Set font
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // 1. DATE (top: 302px, left: 529px, width: 227px => x=756)
  doc.setFontSize(14);
  doc.text(`DATE: ${data.date}`, 756, 324, { align: 'right' });

  // 2. Body Text (top: 359px, left: 38px, width: 680px)
  doc.setFontSize(13);
  const p1 = `This is to Certify that ${data.candidateName} has Successfully Completed a ${data.duration} of Internship at Altruisty Innovation Pvt Ltd, from ${data.startDate} to ${data.endDate}, in the Domain of ${data.domain}.`;
  doc.text(doc.splitTextToSize(p1, 680), 38, 375);

  const p2 = `Throughout the Duration of the Internship, ${data.candidateName} has Demonstrated Remarkable Growth and Development, Gaining Valuable Experience and Insights Into The Field of ${data.domain}.`;
  doc.text(doc.splitTextToSize(p2, 680), 38, 420);

  const p3 = `Their commitment to learning and adapting to new challenges reflects Altruisty's core values of excellence and innovation.`;
  doc.text(doc.splitTextToSize(p3, 680), 38, 465);

  const p4 = `We hereby acknowledge ${data.candidateName} for this outstanding performance and dedication during the internship tenure.`;
  doc.text(doc.splitTextToSize(p4, 680), 38, 495);

  // 3. REG Number (bottom: 160px, right: 84px => x=710, y=963)
  const formattedReg = String(data.regno || '').padStart(4, '0');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`REG:${formattedReg}`, 710, 963, { align: 'right' });

  // 4. Verification QR Code (Centered between signature and seal)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://altruistyinnovation.com';
  const verifyUrl = data.verificationUrl || `${baseUrl}/verify-certificate/${data.certificateId}`;
  
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 250,
    color: { dark: '#000000', light: '#ffffff' },
  });

  // Position QR code in bottom center
  const qrSize = 74;
  const qrX = 360;
  const qrY = 852;
  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  // QR Label
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Scan to Verify Credential', 397, 936, { align: 'center' });
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`ID: ${data.certificateId}`, 397, 945, { align: 'center' });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
