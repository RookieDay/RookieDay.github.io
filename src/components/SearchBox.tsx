'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Report } from '@/lib/types'
import { categories } from '@/lib/types'

export function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Report[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState<Omit<Report, 'content'>[]>([])

  useEffect(() => {
    fetch('/search-index.json')
      .then(res => res.json())
      .then(data => setSearchIndex(data))
      .catch(err => console.error('Failed to load search index:', err))
  }, [])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (q.trim().length > 0) {
      const lowerQuery = q.toLowerCase()
      const filtered = searchIndex.filter(r => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.summary.toLowerCase().includes(lowerQuery) ||
        r.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
      setResults(filtered as Report[])
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [searchIndex])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSearch()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="搜索文章..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query && setIsOpen(true)}
      />
      {query && (
        <button className="search-clear" onClick={clearSearch}>
          ×
        </button>
      )}
      
      {isOpen && results.length > 0 && (
        <div className="search-results">
          <p className="search-results-title">找到 {results.length} 篇文章</p>
          <div className="grid">
            {results.map(report => {
              const category = categories.find(c => c.id === report.category)
              return (
                <article key={report.slug} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{report.title}</h3>
                    <div className="card-meta">
                      <span className="card-category">
                        {category?.icon} {category?.name}
                      </span>
                    </div>
                  </div>
                  <p className="card-summary">{report.summary}</p>
                  <Link 
                    href={`/${report.category}/${report.slug}`} 
                    className="card-link"
                    onClick={clearSearch}
                  >
                    阅读全文
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      )}
      
      {isOpen && query && results.length === 0 && (
        <div className="search-results">
          <div className="empty-state">
            <p>🔍</p>
            <p>未找到相关文章</p>
          </div>
        </div>
      )}
    </div>
  )
}
