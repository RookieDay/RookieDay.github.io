import Link from 'next/link'
import { getReport, getReports, categories, Category, extractHeadings, getAllTags } from '@/lib/reports'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TOC } from '@/components/TOC'
import { ShareButtons } from '@/components/ShareButtons'
import { SearchBox } from '@/components/SearchBox'
import { ThemeToggle } from '@/components/ThemeProvider'

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

export default function ReportPage({ params }: { params: { category: Category; slug: string } }) {
  const report = getReport(params.category, params.slug)
  const category = categories.find(c => c.id === params.category)
  const allTags = getAllTags()

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
            <div className="header-brand">
              <h1>金融简报中心</h1>
              <p>每日金融资讯 · 市场分析 · 行业观点</p>
            </div>
            <div className="header-actions">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-link">今日简报</Link>
            <Link href="/market" className={`nav-link ${params.category === 'market' ? 'active' : ''}`}>市场行情</Link>
            <Link href="/daily" className={`nav-link ${params.category === 'daily' ? 'active' : ''}`}>每日简报</Link>
            <Link href="/fund" className={`nav-link ${params.category === 'fund' ? 'active' : ''}`}>基金追踪</Link>
            <Link href="/monstock" className={`nav-link ${params.category === 'monstock' ? 'active' : ''}`}>月度金股</Link>
            <Link href="/monitor" className={`nav-link ${params.category === 'monitor' ? 'active' : ''}`}>实时监控</Link>
          </div>
        </div>
      </nav>

      <div className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <SearchBox />
          </div>
        </div>
      </div>

      <div className="layout-wrapper">
        <main className="main-content">
          <nav className="breadcrumb">
            <Link href="/">首页</Link>
            <span>/</span>
            <Link href={`/${params.category}`}>{category.name}</Link>
            <span>/</span>
            <span className="current">{report.title}</span>
          </nav>

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
                    <span key={tag} className="article-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="article-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => {
                    const text = String(children)
                    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                    return <h1 id={id}>{children}</h1>
                  },
                  h2: ({ children }) => {
                    const text = String(children)
                    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                    return <h2 id={id}>{children}</h2>
                  },
                  h3: ({ children }) => {
                    const text = String(children)
                    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                    return <h3 id={id}>{children}</h3>
                  }
                }}
              >
                {report.content}
              </ReactMarkdown>
            </div>
            <ShareButtons title={report.title} url={pageUrl} />
          </article>
        </main>

        <aside className="sidebar">
          {headings.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <span className="sidebar-title-icon">📑</span>
                文章目录
              </h3>
              <TOC headings={headings} />
            </div>
          )}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <span className="sidebar-title-icon">🏷️</span>
              内容标签
            </h3>
            <p className="sidebar-desc">点击标签筛选相关内容</p>
            <div className="tag-cloud">
              {allTags.length > 0 ? (
                allTags.map(tag => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag-btn">
                    {tag}
                  </Link>
                ))
              ) : (
                <p className="sidebar-empty">暂无标签</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <p>© 2026 金融简报中心 · 数据仅供参考，不构成投资建议</p>
      </footer>
    </>
  )
}
