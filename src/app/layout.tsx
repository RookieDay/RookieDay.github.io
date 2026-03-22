import type { Metadata, Viewport } from 'next'
import { ThemeToggle } from '@/components/ThemeProvider'
import { BackToTop } from '@/components/BackToTop'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#faf9f5',
}

export const metadata: Metadata = {
  title: '金融简报中心',
  description: '每日金融资讯、市场分析、行业观点',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeToggle />
        {children}
        <BackToTop />
      </body>
    </html>
  )
}
