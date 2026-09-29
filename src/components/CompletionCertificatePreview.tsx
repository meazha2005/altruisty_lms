'use client';

import React, { forwardRef } from 'react';

export interface CompletionCertificateProps {
  candidateName: string;
  domain: string;
  startDate: string;
  endDate: string;
  duration: string;
  date: string;
  regno: string;
  certificateId: string;
  qrCodeDataUrl?: string;
  verificationUrl?: string;
}

const CompletionCertificatePreview = forwardRef<HTMLDivElement, { fields: CompletionCertificateProps }>(
  function CompletionCertificatePreview({ fields }, ref) {
    const {
      candidateName,
      domain,
      startDate,
      endDate,
      duration,
      date,
      regno,
      certificateId,
      qrCodeDataUrl,
      verificationUrl,
    } = fields;

    // REG number zero-padded to 4 digits (matches certificate_lms)
    const formattedReg = String(regno || '').padStart(4, '0');

    const bodyBaseStyle: React.CSSProperties = {
      fontSize: '17.3px',       // 13pt ≈ 17.3px
      lineHeight: '26.5px',     // 7mm ≈ 26.5px
      fontFamily: 'Arial, Helvetica, sans-serif',
      textAlign: 'justify',
      color: '#000',
    };

    return (
      <div
        ref={ref}
        id="completion-certificate-preview"
        className="relative bg-white overflow-hidden shadow-2xl mx-auto"
        style={{
          width: '794px',
          height: '1123px',
          minWidth: '794px',
          minHeight: '1123px',
          maxWidth: '794px',
          maxHeight: '1123px',
          isolation: 'isolate',
          contain: 'layout paint',
        }}
      >
        {/* Background image (A4 full page from certificate_lms) */}
        <img
          src="/completion_bg.jpg"
          alt="Altruisty Certificate Background"
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
          style={{ objectFit: 'cover' }}
        />

        {/* DATE (top right) */}
        <div
          className="absolute"
          style={{
            top: '302px',
            left: '529px',
            width: '227px',
            textAlign: 'right',
            fontSize: '18.7px',    // 14pt ≈ 18.7px
            lineHeight: '30px',
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#000',
            whiteSpace: 'nowrap',
          }}
        >
          DATE: {date}
        </div>

        {/* BODY TEXT */}
        <div
          className="absolute"
          style={{
            top: '359px',
            left: '38px',
            width: '680px',        // 180mm ≈ 680px
            ...bodyBaseStyle,
          }}
        >
          <p style={{ margin: 0 }}>
            This is to Certify that <span className="text-black font-semibold">{candidateName}</span> has
            Successfully Completed a <span className="text-black font-semibold">{duration}</span> of
            Internship at Altruisty Innovation Pvt Ltd, from{' '}
            <span className="text-black font-semibold">{startDate}</span> to{' '}
            <span className="text-black font-semibold">{endDate}</span>, in the Domain of{' '}
            <span className="text-black font-semibold">{domain}</span>.
          </p>

          <p style={{ margin: '26.5px 0 0 0' }}>
            Throughout the Duration of the Internship,{' '}
            <span className="text-black font-semibold">{candidateName}</span> has Demonstrated Remarkable
            Growth and Development, Gaining Valuable Experience and Insights Into The Field of{' '}
            <span className="text-black font-semibold">{domain}</span>.
          </p>

          <p style={{ margin: '26.5px 0 0 0' }}>
            Their commitment to learning and adapting to new challenges reflects
            Altruisty&apos;s core values of excellence and innovation.
          </p>

          <p style={{ margin: '26.5px 0 0 0' }}>
            We hereby acknowledge <span className="text-black font-semibold">{candidateName}</span> for this
            outstanding performance and dedication during the internship tenure.
          </p>
        </div>

        {/* VERIFICATION QR CODE (Positioned cleanly in bottom center) */}
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            bottom: '125px',
            left: '49%',
            transform: 'translateX(-50%)',
            width: '120px',
            zIndex: 10,
          }}
        >
          {qrCodeDataUrl ? (
            <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-xs">
              <img
                src={qrCodeDataUrl}
                alt="Verification QR Code"
                className="w-18 h-18 object-contain block mx-auto"
                style={{ width: '72px', height: '72px' }}
              />
            </div>
          ) : (
            <div className="w-18 h-18 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-[9px] text-slate-400">
              QR Code
            </div>
          )}
          <span
            className="mt-1 font-bold text-slate-900 tracking-tight"
            style={{ fontSize: '9px', fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Scan to Verify
          </span>
          <span
            className="text-slate-600 font-mono tracking-tight"
            style={{ fontSize: '8px', fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            ID: {certificateId}
          </span>
        </div>

        {/* REG ID (Above seal at bottom right) */}
        <div
          className="absolute text-black font-bold"
          style={{
            bottom: '160px',
            right: '84px',
            fontSize: '14px',
            lineHeight: '18px',
            fontFamily: 'Arial, Helvetica, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          REG:<span className="text-black">{formattedReg}</span>
        </div>
      </div>
    );
  }
);

export default CompletionCertificatePreview;
