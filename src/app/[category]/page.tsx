import Link from 'next/link'
import { getReports, categories, Category, CategoryInfo } from '@/lib/reports'
import { notFound } from 'next/navigation'

// 简化 generateStaticParams
export function generateStaticParams() {
  return categories.map(cat => ({ category: cat.id }))
}

export default function CategoryPage({ params }: { params: { category: Category } }) {
  const category = categories.find(c => c.id === params.category)

  if (!category) {
    notFound()
  }

  const reports = getReports(params.category)

  return (
    <main className="container">
      <header className="header">
        <h1>{category.icon} {category.name}</h1>
        <p>{category.description}</p>
      </header>

      <nav className="nav">
        <Link href="/" className="nav-link">今日简报</Link>
        <Link href="/market" className={`nav-link ${params.category === 'market' ? 'active' : ''}`}>市场行情</Link>
        <Link href="/daily" className={`nav-link ${params.category === 'daily' ? 'active' : ''}`}>每日简报</Link>
        <Link href="/fund" className={`nav-link ${params.category === 'fund' ? 'active' : ''}`}>基金追踪</Link>
        <Link href="/monitor" className={`nav-link ${params.category === 'monitor' ? 'active' : ''}`}>实时监控</Link>
      </nav>

      {reports.length > 0 ? (
        <div className="grid">
          {reports.map(report => (
            <div key={report.slug} className="card">
              <div className="card-header">
                <h3 className="card-title">{report.title}</h3>
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
              <p className="card-summary">{report.summary}</p>
              <Link href={`/${report.category}/${report.slug}`} className="card-link">
                查看详情 →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>📭 暂无报告</p>
        </div>
      )}
    </main>
  )
}
