'use client'

import { forwardRef } from 'react'

const OfferPreview = forwardRef(function OfferPreview({ fields }, ref) {
  const { candidateName, domain, startDate, duration, date, regId } = fields

  // Auto-generate today's date as DD-MM-YYYY
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const currentDate = `${dd}-${mm}-${yyyy}`

  return (
    <div
      ref={ref}
      id="offer-letter-preview"
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
      {/* Template background */}
      <img
        src="/template.png"
        alt="Template"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* DATE */}
      <div
        className="absolute"
        style={{
          top: '300px',
          left: '510px',
          width: '227px',
          height: '30px',
          textAlign: 'right',
          fontSize: '18px',
          lineHeight: '30px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#000',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
        }}
      >
        DATE: {date}
      </div>

      {/* Salutation */}
      <div
        className="absolute text-black"
        style={{
          top: '370px',
          left: '50px',
          fontSize: '19px',
          lineHeight: '24px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        Dear <span className="text-black">{candidateName}</span>,
      </div>

      {/* Body */}
      <div
        className="absolute text-black"
        style={{
          top: '430px',
          left: '50px',
          width: '690px',
          fontSize: '18px',
          lineHeight: '30px',
          textAlign: 'justify',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <p style={{ margin: 0 }}>
          We are thrilled to inform you that you have been selected for internship in the
          Altruisty in the domain of <span className="text-black">{domain}</span>.
        </p>
        <p style={{ margin: '30px 0 0 0' }}>
          The internship will commence on <span className="text-black">{startDate}</span> and
          will last for a duration of <span className="text-black">{duration}</span>. During
          this time, you will have the opportunity to gain practical experience, learn from
          industry experts, and collaborate with a team of domain professionals.
        </p>
        <p style={{ margin: '30px 0 0 0' }}>
          We are confident that your skills and dedication will contribute greatly to the
          success of our program, and we look forward to seeing the valuable contributions
          you will make.
        </p>
      </div>

      {/* Reg ID */}
      <div
        className="absolute text-black font-bold"
        style={{
          bottom: '170px',
          right: '84px',
          fontSize: '14px',
          lineHeight: '18px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        REG:<span className="text-black">{regId}</span>
      </div>
    </div>
  )
})

export default OfferPreview