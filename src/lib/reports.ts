import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Category, Report, CategoryInfo } from './types'
import { categories } from './types'

export type { Category, Report, CategoryInfo }
export { categories }

const getContentDirectory = () => {
  const possiblePaths = [
    path.join(process.cwd(), 'content'),
    path.join(process.cwd(), '.next/server/app/content'),
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }

  return path.join(process.cwd(), 'content')
}

const contentDirectory = getContentDirectory()

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

function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+?)(?:\s*\||\n)/)
  return match ? match[1].trim() : '未命名报告'
}

function extractTagsFromContent(content: string): string[] {
  const tagMatch = content.match(/##\s*标签[：:]\s*([^\n]+)/i)
  if (tagMatch) {
    return tagMatch[1].split(/[,，、\s]+/).filter(t => t.length > 0)
  }

  const foundTags: string[] = []
  const contentLower = content.toLowerCase()

  const keywords: Array<[string, string[]]> = [
    ['AI', ['ai', 'openai', 'nvidia', '英伟达', 'anthropic', 'claude', 'gpt', '大模型', '人工智能', '深度学习', '机器学习']],
    ['金融', ['央行', 'lpr', '利率', '货币', 'bank', '金融', '银行']],
    ['市场', ['a股', '港股', '美股', '股市', '指数', 'etf', 'trading', 'market']],
    ['地缘', ['伊朗', '中东', '战争', '特朗普', '普京', '制裁']],
    ['基金', ['基金', 'etf', '投资', '理财', '净值', '管理']],
    ['能源', ['油价', '原油', '石油', 'opec', '天然气', '能源']],
  ]

  for (const [tag, words] of keywords) {
    if (words.some((word: string) => contentLower.includes(word))) {
      foundTags.push(tag)
    }
  }

  if (foundTags.length === 0) {
    foundTags.push('资讯')
  }

  return foundTags.slice(0, 4)
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
        title: data.title || extractTitleFromContent(content),
        date: data.date || new Date().toISOString(),
        category,
        summary: data.summary || content.slice(0, 150) + '...',
        content,
        tags: data.tags || extractTagsFromContent(content)
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
    title: data.title || extractTitleFromContent(content),
    date: data.date || new Date().toISOString(),
    category,
    summary: data.summary || content.slice(0, 150) + '...',
    content,
    tags: data.tags || extractTagsFromContent(content)
  }
}

export function getTodayReports(): Report[] {
  const today = new Date().toISOString().split('T')[0]
  return getReports().filter(r => {
    const dateStr = typeof r.date === 'string' ? r.date : new Date(r.date).toISOString()
    return dateStr.startsWith(today)
  })
}

export function getAllTags(): string[] {
  const reports = getReports()
  const tagSet = new Set<string>()
  reports.forEach(r => r.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export function getReportsByTag(tag: string): Report[] {
  return getReports().filter(r => r.tags.includes(tag))
}

export function searchReports(query: string): Report[] {
  const lowerQuery = query.toLowerCase()
  return getReports().filter(r => 
    r.title.toLowerCase().includes(lowerQuery) ||
    r.summary.toLowerCase().includes(lowerQuery) ||
    r.content.toLowerCase().includes(lowerQuery) ||
    r.tags.some(t => t.toLowerCase().includes(lowerQuery))
  )
}

export function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    headings.push({ level, text, id })
  }

  return headings
}
