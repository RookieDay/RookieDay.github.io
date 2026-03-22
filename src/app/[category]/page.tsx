import Link from 'next/link'
import { getReports, categories, Category } from '@/lib/reports'
import { notFound } from 'next/navigation'

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
    <>
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <h1>{category.icon} {category.name}</h1>
            <p>{category.description}</p>
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
          <span className="current">{category.name}</span>
        </nav>

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
                  {report.tags.length > 0 && (
                    <div className="card-tags">
                      {report.tags.map(tag => (
                        <Link 
                          key={tag} 
                          href={`/?tag=${encodeURIComponent(tag)}`}
                          className="card-tag"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <p className="card-summary">{report.summary}</p>
                <Link href={`/${report.category}/${report.slug}`} className="card-link">
                  阅读全文
                </Link>
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

      <footer className="footer">
        <p>© 2026 金融简报中心 · 数据仅供参考，不构成投资建议</p>
      </footer>
    </>
  )
}
