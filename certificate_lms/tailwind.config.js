/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#2563eb',                 // blue-600
        'accent-hover': '#1d4ed8',         // blue-700
        surface: '#f8fafc',                // slate-50 (page bg)
        'surface-elevated': '#ffffff',     // card bg
        'surface-muted': '#f1f5f9',        // slate-100 (input bg)
        border: '#e2e8f0',                 // slate-200
        'border-strong': '#cbd5e1',        // slate-300
        'text-primary': '#0f172a',         // slate-900
        'text-secondary': '#475569',       // slate-600
        'text-muted': '#94a3b8',           // slate-400
      },
      fontFamily: {
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}