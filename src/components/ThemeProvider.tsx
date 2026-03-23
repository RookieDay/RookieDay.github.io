'use client'

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem(STORAGE_KEY, newTheme)
      return newTheme
    })
  }, [])

  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="切换主题">
        🌙
      </button>
    )
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="切换主题"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
