import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Offer Letter Generator | Altruisty',
  description: 'Generate and email offer letters instantly',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161922',
              color: '#f5f7fa',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          }}
        />
      </body>
    </html>
  )
}