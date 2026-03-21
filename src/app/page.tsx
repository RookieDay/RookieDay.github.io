import Link from 'next/link'
import { getTodayReports, categories, Category } from '@/lib/reports'

function CategorySection({ categoryId, reports }: { categoryId: Category, reports: ReturnType<typeof getTodayReports> }) {
  const category = categories.find(c => c.id === categoryId)
  const categoryReports = reports.filter(r => r.category === categoryId)

  if (categoryReports.length === 0) return null

  return (
    <section className="section">
      <h2 className="category-title">
        <span className="category-icon">{category?.icon}</span>
        {category?.name}
      </h2>
      <div className="grid">
        {categoryReports.map(report => (
          <div key={report.slug} className="card">
            <div className="card-header">
              <h3 className="card-title">{report.title}</h3>
              <span className="card-time">
                {new Date(report.date).toLocaleString('zh-CN', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="card-summary">{report.summary}</p>
            <Link href={`/${report.category}/${report.slug}`} className="card-link">
              查看详情 →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const todayReports = getTodayReports()
  const hasReports = todayReports.length > 0

  return (
    <main className="container">
      <header className="header">
        <h1>📊 金融简报中心</h1>
        <p>每日金融资讯 · 市场分析 · 行业观点</p>
      </header>

      <nav className="nav">
        <Link href="/" className="nav-link active">今日简报</Link>
        <Link href="/market" className="nav-link">市场行情</Link>
        <Link href="/daily" className="nav-link">每日简报</Link>
        <Link href="/fund" className="nav-link">基金追踪</Link>
        <Link href="/monitor" className="nav-link">实时监控</Link>
      </nav>

      {hasReports ? (
        <>
          <CategorySection categoryId="market" reports={todayReports} />
          <CategorySection categoryId="daily" reports={todayReports} />
          <CategorySection categoryId="fund" reports={todayReports} />
          <CategorySection categoryId="monitor" reports={todayReports} />
        </>
      ) : (
        <div className="empty-state">
          <p>📭 今日暂无报告</p>
          <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>报告将在设定时间自动生成</p>
        </div>
      )}
    </main>
  )
}
