import Link from 'next/link'
import { getReport, getReports, categories, extractHeadings } from '@/lib/reports'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TOC } from '@/components/TOC'
import { ShareButtons } from '@/components/ShareButtons'

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

  const headings = extractHeadings(report.content)
  const pageUrl = `https://rookieday.github.io/${params.category}/${params.slug}`

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <h1>金融简报中心</h1>
            <p>每日金融资讯 · 市场分析 · 行业观点</p>
          </div>
        </div>
      </header>

      <nav className="nav">
        <Link href="/" className="nav-link">今日简报</Link>
        <Link href="/market" className={`nav-link ${params.category === 'market' ? 'active' : ''}`}>市场行情</Link>
        <Link href="/daily" className={`nav-link ${params.category === 'daily' ? 'active' : ''}`}>每日简报</Link>
        <Link href="/fund" className={`nav-link ${params.category === 'fund' ? 'active' : ''}`}>基金追踪</Link>
        <Link href="/monitor" className={`nav-link ${params.category === 'monitor' ? 'active' : ''}`}>实时监控</Link>
      </nav>

      <main className="container">
        <nav className="breadcrumb">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href={`/${params.category}`}>{category.name}</Link>
          <span>/</span>
          <span className="current">{report.title}</span>
        </nav>

        <div className="article-layout">
          <article className="article">
            <div className="article-header">
              <h1>{report.title}</h1>
              <div className="article-meta">
                <span>{category.icon} {category.name}</span>
                <span>
                  {new Date(report.date).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {report.tags.length > 0 && (
                <div className="article-tags">
                  {report.tags.map(tag => (
                    <Link 
                      key={tag} 
                      href={`/?tag=${encodeURIComponent(tag)}`}
                      className="article-tag"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="article-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report.content}
              </ReactMarkdown>
            </div>
            <ShareButtons title={report.title} url={pageUrl} />
          </article>
          
          {headings.length > 0 && (
            <aside className="article-sidebar">
              <TOC headings={headings} />
            </aside>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 金融简报中心 · 数据仅供参考，不构成投资建议</p>
      </footer>
    </>
  )
}
