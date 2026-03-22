'use client'

import { useEffect, useState } from 'react'

interface TOCProps {
  headings: { level: number; text: string; id: string }[]
}

export function TOC({ headings }: TOCProps) {
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

  if (headings.length === 0) return null

  return (
    <ul className="toc-list">
      {headings.map(({ level, text, id }) => (
        <li key={id} className="toc-item">
          <a
            href={`#${id}`}
            className={`toc-link ${activeId === id ? 'active' : ''}`}
            data-level={level}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  )
}
