'use client'

import { useEffect, useState } from 'react'

interface MobileTOCProps {
  headings: { level: number; text: string; id: string }[]
}

export function MobileTOC({ headings }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  // 点击目录项后关闭面板
  const handleLinkClick = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 点击遮罩层关闭
  const handleOverlayClick = () => {
    setIsOpen(false)
  }

  // 阻止面板内点击冒泡
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* 浮动按钮 */}
      <button
        className="mobile-toc-button"
        onClick={() => setIsOpen(true)}
        aria-label="打开目录"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <span className="mobile-toc-badge">{headings.length}</span>
      </button>

      {/* 遮罩层 */}
      {isOpen && (
        <div className="mobile-toc-overlay" onClick={handleOverlayClick}>
          {/* 目录面板 */}
          <div className="mobile-toc-panel" onClick={handlePanelClick}>
            <div className="mobile-toc-header">
              <h3 className="mobile-toc-title">
                <span className="mobile-toc-icon">📑</span>
                文章目录
              </h3>
              <button
                className="mobile-toc-close"
                onClick={() => setIsOpen(false)}
                aria-label="关闭目录"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mobile-toc-content">
              <ul className="mobile-toc-list">
                {headings.map(({ level, text, id }) => (
                  <li key={id} className="mobile-toc-item">
                    <button
                      onClick={() => handleLinkClick(id)}
                      className={`mobile-toc-link ${activeId === id ? 'active' : ''}`}
                      data-level={level}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
