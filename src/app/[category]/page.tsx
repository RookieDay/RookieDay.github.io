import Link from 'next/link'
import { getReports, categories, Category, getAllTags } from '@/lib/reports'
import { notFound } from 'next/navigation'
import { SearchBox } from '@/components/SearchBox'
import { ThemeToggle } from '@/components/ThemeProvider'

export function generateStaticParams() {
  return categories.map(cat => ({ category: cat.id }))
}

export default function CategoryPage({ params }: { params: { category: Category } }) {
  const category = categories.find(c => c.id === params.category)

  if (!category) {
    notFound()
  }

  const reports = getReports(params.category)
  const allTags = getAllTags()

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
          <div className="page-header">
            <span className="page-icon">{category.icon}</span>
            <div>
              <h1 className="page-title">{category.name}</h1>
              <p className="page-desc">{category.description} · 共 {reports.length} 篇报告</p>
            </div>
          </div>

          {reports.length > 0 ? (
            <div className="grid">
              {reports.map(report => (
                <article key={report.slug} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{report.title}</h3>
                    <div className="card-meta">
                      <span className="card-time">
                        {new Date(report.date).toLocaleString('zh-CN', {
                          year: 'numeric',
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
                        {report.tags.slice(0, 3).map(tag => (
                          <Link key={tag} href={`/tags/${tag}`} className="card-tag">
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                    <Link href={`/${report.category}/${report.slug}`} className="card-link">
                      阅读 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>📭</p>
              <p>暂无报告</p>
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
              {allTags.length > 0 ? (
                allTags.map(tag => (
                  <Link key={tag} href={`/tags/${tag}`} className="tag-btn">
                    {tag}
                  </Link>
                ))
              ) : (
                <p className="sidebar-empty">暂无标签</p>
              )}
            </div>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <span className="sidebar-title-icon">📁</span>
              分类导航
            </h3>
            <div className="category-nav">
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/${cat.id}`}
                  className={`category-nav-item ${params.category === cat.id ? 'active' : ''}`}
                >
                  <span className="category-nav-icon">{cat.icon}</span>
                  <span className="category-nav-name">{cat.name}</span>
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
