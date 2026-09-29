'use client'

import { forwardRef } from 'react'

const CompletionPreview = forwardRef(function CompletionPreview({ fields }, ref) {
  const { candidateName, domain, startDate, endDate, date, duration, regno } = fields

  // Format today's date as DD-MM-YY (matches Python strftime "%d-%m-%y")
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yy = String(today.getFullYear()).slice(-2)
  const currentDate = `${dd}-${mm}-${yy}`

  // REG number zero-padded to 4 digits (matches Python .zfill(4))
  const formattedReg = String(regno || '').padStart(4, '0')

  const bodyBaseStyle = {
    fontSize: '17.3px',       // 13pt ≈ 17.3px
    lineHeight: '26.5px',     // 7mm ≈ 26.5px
    fontFamily: 'Arial, Helvetica, sans-serif',
    textAlign: 'justify',
    color: '#000',
  }

  return (
    <div
      ref={ref}
      id="completion-certificate-preview"
      className="relative bg-white overflow-hidden shadow-xl"
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
      {/* Background image (full page) */}
      <img
        src="/completion_bg.jpg"
        alt="Certificate Background"
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
          This is to Certify that <span className="text-black">{candidateName}</span> has
          Successfully Completed a <span className="text-black">{duration}</span> of
          Internship at Altruisty Innovation Pvt Ltd, from{' '}
          <span className="text-black">{startDate}</span> to{' '}
          <span className="text-black">{endDate}</span>, in the Domain of{' '}
          <span className="text-black">{domain}</span>.
        </p>

        <p style={{ margin: '26.5px 0 0 0' }}>
          Throughout the Duration of the Internship,{' '}
          <span className="text-black">{candidateName}</span> has Demonstrated Remarkable
          Growth and Development, Gaining Valuable Experience and Insights Into The Field of{' '}
          <span className="text-black">{domain}</span>.
        </p>

        <p style={{ margin: '26.5px 0 0 0' }}>
          Their commitment to learning and adapting to new challenges reflects
          Altruisty&apos;s core values of excellence and innovation.
        </p>

        <p style={{ margin: '26.5px 0 0 0' }}>
          We hereby acknowledge <span className="text-black">{candidateName}</span> for this
          outstanding performance and dedication during the internship tenure.
        </p>
      </div>

      {/* Reg ID */}
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
  )
})

export default CompletionPreview