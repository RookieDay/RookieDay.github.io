'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(title)
    const shareUrl = encodeURIComponent(url)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank')
  }

  const shareToWeibo = () => {
    const text = encodeURIComponent(title)
    const shareUrl = encodeURIComponent(url)
    window.open(`https://service.weibo.com/share/share.php?title=${text}&url=${shareUrl}`, '_blank')
  }

  return (
    <div className="share-section">
      <span className="share-label">分享到：</span>
      <div className="share-buttons">
        <button 
          className={`share-btn ${copied ? 'copied' : ''}`} 
          onClick={copyToClipboard}
          title="复制链接"
        >
          {copied ? '✓' : '🔗'}
        </button>
        <button 
          className="share-btn" 
          onClick={shareToTwitter}
          title="分享到 Twitter"
        >
          𝕏
        </button>
        <button 
          className="share-btn" 
          onClick={shareToWeibo}
          title="分享到微博"
        >
          微
        </button>
      </div>
    </div>
  )
}
