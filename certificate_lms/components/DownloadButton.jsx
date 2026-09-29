'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'

export default function DownloadButton({ candidateName = 'Candidate' }) {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (showModal) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [showModal])

  useEffect(() => {
    if (!showModal) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) setShowModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal, loading])

  const handleGenerate = async () => {
    if (!email) {
      toast.error('Please enter email')
      return
    }

    const element = document.getElementById('offer-letter-preview')
    if (!element) {
      toast.error('Preview not found')
      return
    }

    const scaler = element.closest('[data-preview-scaler]')
    const prevZoom = scaler?.style.zoom

    try {
      setLoading(true)

      if (scaler) {
        scaler.style.zoom = '1'
        void element.offsetHeight
      }

      const html2pdf = (await import('html2pdf.js')).default

      const opt = {
        margin: 0,
        filename: 'Offer_Letter.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: 'px',
          format: [794, 1123],
          orientation: 'portrait',
        },
      }

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob')

      const formData = new FormData()
      formData.append('pdf', pdfBlob, 'Offer-Letter.pdf')
      formData.append('candidateEmail', email)
      formData.append('candidateName', candidateName)
      formData.append('documentType', 'offer')

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.message || 'Email sending failed')
        return
      }

      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Offer_Letter.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Offer letter emailed successfully!')
      setShowModal(false)
      setEmail('')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      if (scaler) {
        scaler.style.zoom = prevZoom || ''
      }
      setLoading(false)
    }
  }

  const modalContent = showModal ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={() => !loading && setShowModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-border rounded-2xl p-7 flex flex-col gap-5 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.25)] text-text-primary"
        style={{ animation: 'popIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold tracking-tight text-text-primary m-0">
            Send Offer Letter
          </h3>
          <p className="text-xs text-text-muted m-0">
            Enter the candidate&apos;s email to deliver the PDF
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="candidate-email"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary"
          >
            Candidate Email
          </label>
          <input
            id="candidate-email"
            type="email"
            placeholder="candidate@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) handleGenerate()
            }}
            autoFocus
            className="w-full h-11 bg-surface-muted border border-border rounded-lg px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => setShowModal(false)}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-secondary bg-surface-muted border border-border hover:bg-slate-200/60 hover:text-text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent-hover shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[110px] justify-center"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
    <button
      onClick={() => setShowModal(true)}
      aria-label="Send PDF"
      className="inline-flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 text-[13.5px] font-semibold text-white rounded-lg cursor-pointer whitespace-nowrap tracking-wide border border-transparent shadow-[0_2px_10px_rgba(37,99,235,0.30)] transition-all duration-300 bg-accent hover:bg-accent-hover hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(37,99,235,0.40)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <svg 
        className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path
          d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hidden sm:inline">Send PDF</span>
    </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}