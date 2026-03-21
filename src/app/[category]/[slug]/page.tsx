import Link from 'next/link'
import { getReport, getReports, categories } from '@/lib/reports'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function generateStaticParams() {
  const params: { category: string; slug: string }[] = []

  for (const cat of categories) {
    const reports = getReports(cat.id)
    for (const report of reports) {
      params.push({ category: cat.id, slug: report.slug })
    }
  }

  if (params.length === 0) {
    return categories.map(cat => ({ category: cat.id, slug: 'placeholder' }))
  }

  return params
}

export default function ReportPage({ params }: { params: { category: string; slug: string } }) {
  const report = getReport(params.category as any, params.slug)
  const category = categories.find(c => c.id === params.category)

  if (!report || !category) {
    notFound()
  }

  return (
    <main className="container">
      <Link href={`/${params.category}`} className="back-link">
        ← 返回{category.name}
      </Link>

      <article className="article">
        <h1>{report.title}</h1>
        <div className="article-meta">
          <span>{category.icon} {category.name}</span>
          <span>📅 {new Date(report.date).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        <div className="article-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
