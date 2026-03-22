import Link from 'next/link'
import { getReportsByTag, categories, Category, getAllTags } from '@/lib/reports'
import { notFound } from 'next/navigation'
import { SearchBox } from '@/components/SearchBox'
import { ThemeToggle } from '@/components/ThemeProvider'

export function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(tag => ({ tag: encodeURIComponent(tag) }))
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tagName = decodeURIComponent(params.tag)
  const reports = getReportsByTag(tagName)
  const allTags = getAllTags()

  if (reports.length === 0 && !allTags.includes(tagName)) {
    notFound()
  }

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
            <Link href="/market" className="nav-link">市场行情</Link>
            <Link href="/daily" className="nav-link">每日简报</Link>
            <Link href="/fund" className="nav-link">基金追踪</Link>
            <Link href="/monitor" className="nav-link">实时监控</Link>
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
          <div className="page-header">
            <span className="page-icon">🏷️</span>
            <div>
              <h1 className="page-title">标签: {tagName}</h1>
              <p className="page-desc">共找到 {reports.length} 篇相关报告</p>
            </div>
          </div>

          {reports.length > 0 ? (
            <div className="grid">
              {reports.map(report => {
                const category = categories.find(c => c.id === report.category)
                return (
                  <article key={`${report.category}-${report.slug}`} className="card">
                    <div className="card-header">
                      <h3 className="card-title">{report.title}</h3>
                      <div className="card-meta">
                        <span className="card-category">{category?.icon} {category?.name}</span>
                        <span className="card-time">
                          {new Date(report.date).toLocaleString('zh-CN', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="card-summary">{report.summary}</p>
                    <div className="card-footer">
                      {report.tags.length > 0 && (
                        <div className="card-tags">
                          {report.tags.slice(0, 3).map(t => (
                            <span key={t} className={`card-tag ${t === tagName ? 'active' : ''}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link href={`/${report.category}/${report.slug}`} className="card-link">
                        阅读 →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>📭</p>
              <p>暂无相关报告</p>
            </div>
          )}
        </main>

        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <span className="sidebar-title-icon">🏷️</span>
              内容标签
            </h3>
            <p className="sidebar-desc">点击标签筛选相关内容</p>
            <div className="tag-cloud">
              {allTags.map(t => (
                <Link 
                  key={t} 
                  href={`/tags/${encodeURIComponent(t)}`}
                  className={`tag-btn ${t === tagName ? 'active' : ''}`}
                >
                  {t}
                </Link>
              ))}
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
