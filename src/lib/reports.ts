import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Category, Report, CategoryInfo } from './types'
import { categories } from './types'

export type { Category, Report, CategoryInfo }
export { categories }

let contentDirectory: string | null = null

const getContentDirectory = () => {
  if (contentDirectory) return contentDirectory
  
  // 确保 process.cwd() 存在
  const cwd = process.cwd()
  if (!cwd) {
    throw new Error('process.cwd() returned undefined')
  }
  
  const possiblePaths = [
    path.join(cwd, 'content'),
    path.join(cwd, '.next/server/app/content'),
  ]

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) {
      contentDirectory = p
      return contentDirectory
    }
  }

  contentDirectory = path.join(cwd, 'content')
  return contentDirectory
}

export function getReports(category?: Category): Report[] {
  const contentDir = getContentDirectory()
  const targetDir = category
    ? path.join(contentDir, category)
    : contentDir

  if (!fs.existsSync(targetDir)) {
    return []
  }

  let allReports: Report[] = []

  if (category) {
    allReports = getReportsFromDir(targetDir, category)
  } else {
    for (const cat of categories) {
      const catDir = path.join(contentDir, cat.id)
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

  // 核心关键词映射（精简版，10个分类左右）
  const keywords: Array<[string, string[]]> = [
    ['AI', ['ai', '英伟达', 'openai', '人工智能']],
    ['金融', ['央行', '利率', '金融', '银行']],
    ['市场', ['a股', '港股', '美股', '股市']],
    ['地缘', ['伊朗', '特朗普', '战争', '中东']],
    ['基金', ['基金', 'etf']],
    ['能源', ['油价', '原油', '石油']],
    ['行业', ['行业', '产业', '板块']],
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

      // 从文件名中提取日期 (格式: 2026-03-24-xxx.md)
      const dateFromFilename = file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1]
      
      // 优先级：frontmatter.date > 文件名日期 > 当前时间
      let date = data.date
      if (!date && dateFromFilename) {
        date = `${dateFromFilename}T00:00:00.000Z`
      }
      if (!date) {
        date = new Date().toISOString()
      }

      return {
        slug: file.replace('.md', ''),
        title: data.title || extractTitleFromContent(content),
        date,
        category,
        summary: data.summary || content.slice(0, 150) + '...',
        content,
        tags: data.tags || extractTagsFromContent(content)
      }
    })
}

export function getReport(category: Category, slug: string): Report | null {
  const contentDir = getContentDirectory()
  const filePath = path.join(contentDir, category, `${slug}.md`)

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
