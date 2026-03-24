import Link from 'next/link'
import { getTodayReports, categories, Category, getAllTags } from '@/lib/reports'
import { SearchBox } from '@/components/SearchBox'
import { ThemeToggle } from '@/components/ThemeProvider'

function CategorySection({ categoryId, reports }: { categoryId: Category, reports: ReturnType<typeof getTodayReports> }) {
  const category = categories.find(c => c.id === categoryId)
  const categoryReports = reports.filter(r => r.category === categoryId)

  if (categoryReports.length === 0) return null

  return (
    <section className="section">
      <div className="category-header">
        <span className="category-icon">{category?.icon}</span>
        <h2 className="category-title">{category?.name}</h2>
        <span className="category-count">{categoryReports.length} 篇</span>
      </div>
      <div className="grid">
        {categoryReports.map(report => (
          <article key={report.slug} className="card">
            <div className="card-header">
              <h3 className="card-title">{report.title}</h3>
              <div className="card-meta">
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
                  {report.tags.slice(0, 3).map(tag => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="card-tag">
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
    </section>
  )
}

export default function Home() {
  const todayReports = getTodayReports()
  const allTags = getAllTags()
  const hasReports = todayReports.length > 0

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
            <Link href="/" className="nav-link active">今日简报</Link>
            <Link href="/market" className="nav-link">市场行情</Link>
            <Link href="/daily" className="nav-link">每日简报</Link>
            <Link href="/fund" className="nav-link">基金追踪</Link>
            <Link href="/monstock" className="nav-link">月度金股</Link>
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
          {hasReports ? (
            <>
              <CategorySection categoryId="market" reports={todayReports} />
              <CategorySection categoryId="daily" reports={todayReports} />
              <CategorySection categoryId="fund" reports={todayReports} />
              <CategorySection categoryId="monitor" reports={todayReports} />
            </>
          ) : (
            <div className="empty-state">
              <p>📭</p>
              <p>今日暂无报告</p>
              <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>报告将在设定时间自动生成</p>
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
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag-btn">
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
              <span className="sidebar-title-icon">📊</span>
              今日统计
            </h3>
            <div className="stats-grid">
              {categories.map(cat => {
                const count = todayReports.filter(r => r.category === cat.id).length
                return (
                  <div key={cat.id} className="stat-card">
                    <span className="stat-icon">{cat.icon}</span>
                    <span className="stat-name">{cat.name}</span>
                    <span className="stat-count">{count}</span>
                  </div>
                )
              })}
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
