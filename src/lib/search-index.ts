import fs from 'fs'
import path from 'path'
import { getReports } from './reports'
import type { Report } from './types'

export function generateSearchIndex(): Omit<Report, 'content'>[] {
  const reports = getReports()
  return reports.map(({ slug, title, date, category, summary, tags }) => ({
    slug,
    title,
    date,
    category,
    summary,
    tags
  }))
}

export function writeSearchIndex(outputDir: string) {
  const searchIndex = generateSearchIndex()
  const outputPath = path.join(outputDir, 'search-index.json')
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2))
}
