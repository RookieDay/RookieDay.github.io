'use client'

import { useEffect, useState, useCallback } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [autoMode, setAutoMode] = useState(true)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const autoModeSetting = localStorage.getItem('autoTheme')

    if (autoModeSetting === 'false') {
      setAutoMode(false)
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setAutoMode(false)
    localStorage.setItem('autoTheme', 'false')

    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
      return newTheme
    })
  }, [])

  const enableAutoMode = useCallback(() => {
    setAutoMode(true)
    localStorage.setItem('autoTheme', 'true')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const newTheme = prefersDark ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.removeItem('theme')
  }, [])

  if (!mounted) {
    return (
      <div className="theme-toggle-wrapper">
        <button className="theme-toggle" aria-label="切换主题">🌙</button>
      </div>
    )
  }

  return (
    <div className="theme-toggle-wrapper">
      {autoMode ? (
        <button
          className="theme-toggle auto"
          onClick={toggleTheme}
          aria-label="跟随系统，点击切换手动模式"
          title="自动跟随系统"
        >
          ⚙️
        </button>
      ) : (
        <button
          className="theme-toggle"
          onClick={enableAutoMode}
          aria-label="切换到自动模式"
          title="切换到自动模式"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}
    </div>
  )
}
