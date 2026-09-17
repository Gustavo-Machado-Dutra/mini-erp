import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RevenueFlow',
  description: 'SaaS B2B para recuperacao de oportunidades comerciais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
