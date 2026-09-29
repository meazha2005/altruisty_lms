'use client'

const FIELD_GROUPS = [
  {
    group: 'Candidate',
    fields: [
      { label: 'Candidate Name', key: 'candidateName', placeholder: 'Full name' },
      { label: 'Domain / Role', key: 'domain', placeholder: 'e.g. Data Analytics' },
    ],
  },
  {
    group: 'Internship Period',
    fields: [
      { label: 'Issue Date', key: 'date', placeholder: 'DD-MM-YY' },
      { label: 'Start Date', key: 'startDate', placeholder: 'DD-M-YY' },
      { label: 'End Date', key: 'endDate', placeholder: 'DD-M-YY' },
      { label: 'Duration', key: 'duration', placeholder: 'e.g. 1 month' },
    ],
  },
  {
    group: 'Registration',
    fields: [
      { label: 'Registration ID', key: 'regno', placeholder: 'e.g. 1252025936' },
    ],
  },
]

export default function CompletionForm({ fields, onChange }) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-7">
        {FIELD_GROUPS.map(({ group, fields: groupFields }) => (
          <div key={group} className="flex flex-col gap-3.5">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-text-muted pb-2 border-b border-border">
              {group}
            </div>
            {groupFields.map(({ label, key, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label
                  htmlFor={key}
                  className="text-[13px] font-medium text-text-secondary"
                >
                  {label}
                </label>
                <input
                  id={key}
                  type="text"
                  value={fields[key] || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={placeholder}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full bg-surface-muted border border-border rounded-lg text-text-primary text-sm px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/10 hover:border-border-strong placeholder:text-text-muted/70"
                />
              </div>
            ))}
          </div>
        ))}

        <div className="mt-2">
          <p className="flex items-start gap-2 text-xs text-text-secondary bg-blue-50 border border-blue-100 rounded-lg p-3 leading-relaxed">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0 text-blue-500"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Live edits reflect instantly in the preview
          </p>
        </div>
      </div>
    </div>
  )
}