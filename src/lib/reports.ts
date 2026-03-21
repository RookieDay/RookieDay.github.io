import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 在静态导出时使用不同的路径解析方式
const getContentDirectory = () => {
  // 尝试多种路径
  const possiblePaths = [
    path.join(process.cwd(), 'content'),
    path.join(process.cwd(), '.next/server/app/content'),
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }

  // 默认返回
  return path.join(process.cwd(), 'content')
}

const contentDirectory = getContentDirectory()

export type Category = 'market' | 'daily' | 'monitor' | 'fund'

export interface Report {
  slug: string
  title: string
  date: string
  category: Category
  summary: string
  content: string
}

export interface CategoryInfo {
  id: Category
  name: string
  icon: string
  description: string
}

export const categories: CategoryInfo[] = [
  {
    id: 'market',
    name: '市场行情',
    icon: '📈',
    description: '全球市场早报、A股港股点评'
  },
  {
    id: 'daily',
    name: '每日简报',
    icon: '📰',
    description: '财经简报、AI新闻、伊朗局势'
  },
  {
    id: 'fund',
    name: '基金追踪',
    icon: '💰',
    description: '基金日报、行业观点'
  },
  {
    id: 'monitor',
    name: '实时监控',
    icon: '🔔',
    description: '特朗普推文监控'
  }
]

export function getReports(category?: Category): Report[] {
  const targetDir = category
    ? path.join(contentDirectory, category)
    : contentDirectory

  if (!fs.existsSync(targetDir)) {
    return []
  }

  let allReports: Report[] = []

  if (category) {
    allReports = getReportsFromDir(targetDir, category)
  } else {
    for (const cat of categories) {
      const catDir = path.join(contentDirectory, cat.id)
      if (fs.existsSync(catDir)) {
        allReports = allReports.concat(getReportsFromDir(catDir, cat.id))
      }
    }
  }

  return allReports.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

function getReportsFromDir(dir: string, category: Category): Report[] {
  const files = fs.readdirSync(dir)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(dir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)

      return {
        slug: file.replace('.md', ''),
        title: data.title || '未命名报告',
        date: data.date || new Date().toISOString(),
        category,
        summary: data.summary || content.slice(0, 150) + '...',
        content
      }
    })
}

export function getReport(category: Category, slug: string): Report | null {
  const filePath = path.join(contentDirectory, category, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    title: data.title || '未命名报告',
    date: data.date || new Date().toISOString(),
    category,
    summary: data.summary || content.slice(0, 150) + '...',
    content
  }
}

export function getTodayReports(): Report[] {
  const today = new Date().toISOString().split('T')[0]
  return getReports().filter(r => {
    const dateStr = typeof r.date === 'string' ? r.date : new Date(r.date).toISOString()
    return dateStr.startsWith(today)
  })
}
