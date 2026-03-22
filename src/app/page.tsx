import Link from 'next/link'
import { getTodayReports, categories, Category } from '@/lib/reports'

function CategorySection({ categoryId, reports }: { categoryId: Category, reports: ReturnType<typeof getTodayReports> }) {
  const category = categories.find(c => c.id === categoryId)
  const categoryReports = reports.filter(r => r.category === categoryId)

  if (categoryReports.length === 0) return null

  return (
    <section className="section">
      <div className="category-header">
        <span className="category-icon">{category?.icon}</span>
        <h2 className="category-title">{category?.name}</h2>
      </div>
      <div className="grid">
        {categoryReports.map(report => (
          <article key={report.slug} className="card">
            <div className="card-header">
              <h3 className="card-title">{report.title}</h3>
              <div className="card-meta">
                <span className="card-category">
                  {category?.icon} {category?.name}
                </span>
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
            <Link href={`/${report.category}/${report.slug}`} className="card-link">
              阅读全文
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const todayReports = getTodayReports()
  const hasReports = todayReports.length > 0

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
        <Link href="/" className="nav-link active">今日简报</Link>
        <Link href="/market" className="nav-link">市场行情</Link>
        <Link href="/daily" className="nav-link">每日简报</Link>
        <Link href="/fund" className="nav-link">基金追踪</Link>
        <Link href="/monitor" className="nav-link">实时监控</Link>
      </nav>

      <main className="container">
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

      <footer className="footer">
        <p>© 2026 金融简报中心 · 数据仅供参考，不构成投资建议</p>
      </footer>
    </>
  )
}
