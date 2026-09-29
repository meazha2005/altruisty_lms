'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompletionCertificatePreview from '@/components/CompletionCertificatePreview';
import {
  ShieldCheck,
  AlertTriangle,
  Printer,
  Loader2,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-scale certificate for viewport
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 16;
      setScale(Math.min(availableWidth / 794, 1));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [certData]);

  const handleDownloadPDF = async () => {
    const certElement = document.getElementById('completion-certificate-preview');
    if (!certElement || !certData) return;

    try {
      setDownloading('pdf');
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const dataUrl = await toPng(certElement, {
        quality: 1,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, 1123],
        compress: true,
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 794, 1123, undefined, 'FAST');
      const sanitizedName = (certData.student_name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`Altruisty_Certificate_${sanitizedName}_${certData.certificate_id}.pdf`);
    } catch (err: any) {
      console.error('Failed to download certificate as PDF', err);
      window.print();
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPNG = async () => {
    const certElement = document.getElementById('completion-certificate-preview');
    if (!certElement || !certData) return;

    try {
      setDownloading('png');
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(certElement, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      const sanitizedName = (certData.student_name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `Altruisty_Certificate_${sanitizedName}_${certData.certificate_id}.png`;
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
            width: 250,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
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

  // Format dates for the certificate matching certificate_lms standard
  const issueDateObj = certData ? new Date(certData.issue_date) : new Date();
  const dd = String(issueDateObj.getDate()).padStart(2, '0');
  const mm = String(issueDateObj.getMonth() + 1).padStart(2, '0');
  const yy = String(issueDateObj.getFullYear()).slice(-2);
  const yyyy = issueDateObj.getFullYear();
  const formattedDate = `${dd}-${mm}-${yy}`;

  const startDateObj = new Date(issueDateObj);
  startDateObj.setDate(startDateObj.getDate() - 30);
  const s_dd = String(startDateObj.getDate()).padStart(2, '0');
  const s_mm = String(startDateObj.getMonth() + 1).padStart(2, '0');
  const s_yyyy = startDateObj.getFullYear();
  const formattedStartDate = `${s_dd}-${s_mm}-${s_yyyy}`;
  const formattedEndDate = `${dd}-${mm}-${yyyy}`;

  const extractedReg = certData?.certificate_id ? certData.certificate_id.split('-').pop() || '0001' : '0001';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
              {/* Authenticity Banner & Actions */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                      Official Verification Status
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold">100% Authentic & Verified Credential</h2>
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
                    title="Print via Browser"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              {/* Certificate Container with Proportional Scale */}
              <div
                ref={containerRef}
                className="w-full flex justify-center items-start overflow-hidden py-2"
                style={{ height: `${1123 * scale}px` }}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '794px',
                    height: '1123px',
                    flexShrink: 0,
                  }}
                >
                  <CompletionCertificatePreview
                    fields={{
                      candidateName: certData.student_name,
                      domain: certData.track_name,
                      startDate: formattedStartDate,
                      endDate: formattedEndDate,
                      duration: certData.duration,
                      date: formattedDate,
                      regno: extractedReg,
                      certificateId: certData.certificate_id,
                      qrCodeDataUrl: qrCodeDataUrl || undefined,
                      verificationUrl: typeof window !== 'undefined' ? window.location.href : undefined,
                    }}
                  />
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
