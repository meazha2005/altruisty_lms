'use client'

import { useState, useRef, useEffect } from 'react'
import OfferForm from '@/components/OfferForm'
import OfferPreview from '@/components/OfferPreview'
import DownloadButton from '@/components/DownloadButton'
import CompletionForm from '@/components/CompletionForm'
import CompletionPreview from '@/components/CompletionPreview'
import CompletionDownloadButton from '@/components/CompletionDownloadButton'

const DEFAULT_OFFER_FIELDS = {
  candidateName: 'S Sandeep Kumaar',
  domain: 'Data Analytics',
  date: '02-5-2026',
  startDate: '4-5-2026',
  duration: '1 month',
  hrName: 'Bhavithra A N',
  regId: '1252025936',
  email: 'altruistybusiness@gmail.com',
  phone: '8667839838',
}

const DEFAULT_COMPLETION_FIELDS = {
  candidateName: 'S Sandeep Kumaar',
  domain: 'Data Analytics',
  startDate: '4-5-2026',
  endDate: '4-6-2026',
  date: '02-5-2026',
  duration: '1 month',
  regno: '1252025936',
}

const BASE_WIDTH = 794
const BASE_HEIGHT = 1123

const TABS = [
  {
    id: 'offer',
    label: 'Offer Letter',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12h6M9 16h6M9 8h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'completion',
    label: 'Completion Certificate',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
        <path
          d="M9 14l-2 8 5-3 5 3-2-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function App() {
  const [activeView, setActiveView] = useState('offer')
  const [offerFields, setOfferFields] = useState(DEFAULT_OFFER_FIELDS)
  const [completionFields, setCompletionFields] = useState(DEFAULT_COMPLETION_FIELDS)
  const [scale, setScale] = useState(1)

  const offerPreviewRef = useRef(null)
  const completionPreviewRef = useRef(null)
  const containerRef = useRef(null)

  const isOffer = activeView === 'offer'

  const handleOfferChange = (name, value) =>
    setOfferFields((prev) => ({ ...prev, [name]: value }))

  const handleCompletionChange = (name, value) =>
    setCompletionFields((prev) => ({ ...prev, [name]: value }))

  // Auto-scale preview based on container width
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const padding = 48
      const availableWidth = containerRef.current.clientWidth - padding
      setScale(Math.min(availableWidth / BASE_WIDTH, 1))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [activeView])

  return (
    <div className="min-h-screen bg-surface text-text-primary flex flex-col">
      {/* ─── Header / Navbar ─── */}
      <header className="no-print sticky top-0 z-30 border-b border-border bg-surface-elevated/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 max-w-[1600px] mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent grid place-items-center ring-1 ring-accent/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12h6M9 16h6M9 8h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-tight hidden sm:flex">
              <span className="text-sm font-semibold tracking-tight text-text-primary">
                Altruisty
              </span>
              <span className="text-[11px] text-text-muted">
                Document Generator
              </span>
            </div>
          </div>

          {/* Center: Tabs */}
          <nav className="flex items-center gap-1 p-1 rounded-xl bg-surface-muted border border-border">
            {TABS.map((tab) => {
              const isActive = activeView === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-accent shadow-sm ring-1 ring-border'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-accent' : 'text-text-muted'}>
                    {tab.icon}
                  </span>
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                  <span className="xs:hidden sm:hidden">
                    {tab.id === 'offer' ? 'Offer' : 'Certificate'}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Right: Download */}
          <div className="shrink-0">
            {isOffer ? (
              <DownloadButton candidateName={offerFields.candidateName} />
            ) : (
              <CompletionDownloadButton
                candidateName={completionFields.candidateName}
              />
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Layout: Form | Preview ─── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] max-w-[1600px] w-full mx-auto">
        {/* Form Panel */}
        <aside className="no-print border-b lg:border-b-0 lg:border-r border-border bg-surface-elevated p-5 sm:p-6 flex flex-col max-h-none lg:max-h-[calc(100vh-64px)] lg:sticky lg:top-[64px] overflow-y-auto">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h2 className="text-base font-semibold tracking-tight text-text-primary">
                {isOffer ? 'Offer Letter Details' : 'Certificate Details'}
              </h2>
            </div>
            <p className="text-xs text-text-muted mt-1.5">
              Live preview updates as you type
            </p>
          </div>

          {isOffer ? (
            <OfferForm fields={offerFields} onChange={handleOfferChange} />
          ) : (
            <CompletionForm
              fields={completionFields}
              onChange={handleCompletionChange}
            />
          )}
        </aside>

        {/* Preview Panel */}
        <section
          ref={containerRef}
          className="p-4 sm:p-6 flex flex-col items-center w-full min-w-0 bg-surface overflow-x-hidden"
        >
          <div className="no-print w-full max-w-[794px] flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Preview
            </span>
            <span className="text-xs text-text-muted font-medium">
              {Math.round(scale * 100)}% · A4
            </span>
          </div>

          <div
            className="w-full flex justify-center items-start overflow-hidden"
            style={{ height: `${BASE_HEIGHT * scale}px` }}
          >
            <div
              data-preview-scaler
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: `${BASE_WIDTH}px`,
                height: `${BASE_HEIGHT}px`,
                flexShrink: 0,
              }}
            >
              {isOffer ? (
                <OfferPreview ref={offerPreviewRef} fields={offerFields} />
              ) : (
                <CompletionPreview
                  ref={completionPreviewRef}
                  fields={completionFields}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}