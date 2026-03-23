export type Category = 'market' | 'daily' | 'monitor' | 'fund' | 'monstock'

export interface Report {
  slug: string
  title: string
  date: string
  category: Category
  summary: string
  content: string
  tags: string[]
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
  },
  {
    id: 'monstock',
    name: '月度金股',
    icon: '🎯',
    description: '月度金股推荐、选股策略'
  }
]
