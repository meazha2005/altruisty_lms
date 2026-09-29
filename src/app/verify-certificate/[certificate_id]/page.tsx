'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ExternalLink,
  Loader2,
  Building2,
  User,
  GraduationCap,
  Download,
  FileDown,
} from 'lucide-react';

export default function CertificateVerificationDetailPage({
  params,
}: {
  params: Promise<{ certificate_id: string }>;
}) {
  const resolvedParams = use(params);
  const certificateId = resolvedParams.certificate_id;

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<'pdf' | 'png' | null>(null);
  const [certData, setCertData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    const certElement = document.getElementById('certificate-print-area');
    if (!certElement) return;

    try {
      setDownloading('pdf');
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const dataUrl = await toPng(certElement, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const img = new (window as any).Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const margin = 8;
      const availWidth = pdfWidth - margin * 2;
      const availHeight = pdfHeight - margin * 2;
      const imgRatio = img.width / img.height;

      let renderWidth = availWidth;
      let renderHeight = availWidth / imgRatio;

      if (renderHeight > availHeight) {
        renderHeight = availHeight;
        renderWidth = availHeight * imgRatio;
      }

      const xPos = (pdfWidth - renderWidth) / 2;
      const yPos = (pdfHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', xPos, yPos, renderWidth, renderHeight);
      pdf.save(`Altruisty-Certificate-${certData?.certificate_id || 'credential'}.pdf`);
    } catch (err: any) {
      console.error('Failed to download certificate as PDF', err);
      window.print();
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPNG = async () => {
    const certElement = document.getElementById('certificate-print-area');
    if (!certElement) return;

    try {
      setDownloading('png');
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(certElement, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `Altruisty-Certificate-${certData?.certificate_id || 'credential'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Failed to download certificate as PNG', err);
      window.print();
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    async function verify() {
      try {
        setLoading(true);
        const res = await fetch(`/api/verify/${encodeURIComponent(certificateId)}`);
        const json = await res.json();

        if (!res.ok || !json.valid) {
          throw new Error(json.error || 'Certificate not found or revoked');
        }

        setCertData(json.certificate);

        if (typeof window !== 'undefined') {
          const qrUrl = await QRCode.toDataURL(window.location.href, {
            width: 130,
            margin: 1,
            color: { dark: '#1b449c', light: '#ffffff' },
          });
          setQrCodeDataUrl(qrUrl);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Invalid certificate credential ID');
      } finally {
        setLoading(false);
      }
    }

    if (certificateId) {
      verify();
    }
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {errorMsg || !certData ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-xl space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Certificate Verification Failed</h1>
              <p className="text-xs text-slate-600">
                No active certificate found matching ID: <strong>{certificateId}</strong>.
              </p>
              <Link
                href="/verify-certificate"
                className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Try Another ID
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Authenticity Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                      Official Verification Status
                    </span>
                    <h2 className="text-xl font-bold">100% Authentic & Verified Credential</h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading !== null}
                    className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-75"
                  >
                    {downloading === 'pdf' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-emerald-700" />
                        <span>Download Certificate</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadPNG}
                    disabled={downloading !== null}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 border border-emerald-500/50 shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-75"
                    title="Download high-resolution image"
                  >
                    {downloading === 'png' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4 text-emerald-200" />
                    )}
                    <span>Image (PNG)</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 text-xs font-bold flex items-center gap-1.5 border border-emerald-600/40 transition-all shrink-0 cursor-pointer"
                    title="Print / Save PDF via Browser"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              {/* Printable Certificate Canvas */}
              <div
                id="certificate-print-area"
                className="bg-white rounded-3xl p-6 sm:p-12 border-8 border-slate-100 shadow-2xl relative overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(#1b449c08 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {/* Decorative Borders */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-blue-800 pointer-events-none" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-blue-800 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-blue-800 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-blue-800 pointer-events-none" />

                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <img
                      src="/logo.png"
                      alt="Altruisty Innovation"
                      className="h-14 sm:h-16 w-auto object-contain"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-black tracking-widest uppercase text-blue-800 border-b-2 border-blue-600 pb-1">
                      ALTRUISTY INNOVATION PVT LTD
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight pt-1">
                    CERTIFICATE OF INTERNSHIP
                  </h1>
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">
                    THIS CREDENTIAL IS PROUDLY PRESENTED TO
                  </p>
                </div>

                <div className="text-center my-6">
                  <div className="text-2xl sm:text-4xl font-serif font-bold text-blue-900 italic border-b-2 border-slate-300 pb-2 inline-block px-6 sm:px-8 min-w-[260px] sm:min-w-[320px]">
                    {certData.student_name}
                  </div>
                </div>

                <div className="text-center max-w-2xl mx-auto space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <p>
                    For successfully completing the{' '}
                    <strong className="text-slate-900 font-bold capitalize">{certData.category} Internship</strong>{' '}
                    program in{' '}
                    <strong className="text-blue-800 font-bold">{certData.track_name}</strong> ({certData.duration})
                    demonstrating high competence, commitment, and practical software engineering excellence.
                  </p>
                  <p className="text-xs text-slate-500">
                    Graded with Distinction: <strong className="text-emerald-700 font-bold">{certData.grade}</strong> • Mode: <strong className="capitalize">{certData.mode}</strong>
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                  {/* Left: QR Verification */}
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {qrCodeDataUrl && (
                      <div className="p-1 sm:p-1.5 bg-white border border-slate-200 rounded-lg shadow-xs shrink-0">
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code"
                          className="w-14 h-14 sm:w-18 sm:h-18 object-contain"
                        />
                      </div>
                    )}
                    <div className="text-left text-[10px] sm:text-[11px] text-slate-500">
                      <span className="font-bold text-slate-800 block text-xs">Scan to Verify</span>
                      <span className="font-mono">ID: {certData.certificate_id}</span><br />
                      <span className="text-emerald-600 font-semibold">✓ Verified Authenticity</span>
                    </div>
                  </div>

                  {/* Right: Signature */}
                  <div className="text-right">
                    <div className="font-serif italic text-base sm:text-lg font-bold text-blue-950">
                      Managing Director
                    </div>
                    <div className="w-28 sm:w-36 h-0.5 bg-slate-300 my-1 ml-auto" />
                    <p className="text-[11px] sm:text-xs font-bold text-slate-800">Altruisty Innovation Pvt Ltd</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Authorized Signatory</p>
                  </div>
                </div>
              </div>

              {/* Verification Metadata Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Credential Audit Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Credential ID</span>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{certData.certificate_id}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Issue Date</span>
                    <p className="font-bold text-slate-800 mt-0.5">{new Date(certData.issue_date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Duration</span>
                    <p className="font-bold text-slate-800 mt-0.5 capitalize">{certData.duration}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Status</span>
                    <p className="font-bold text-emerald-600 mt-0.5">Active & Valid</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
