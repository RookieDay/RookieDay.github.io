#!/usr/bin/env node
/**
 * 金融报告生成脚本
 * 用于从定时任务生成 Markdown 报告文件
 */

const fs = require('fs');
const path = require('path');

// 报告类型配置
const REPORT_TYPES = {
  'global-market-morning': {
    category: 'market',
    title: '全球市场早报',
    time: '07:30',
  },
  'daily-finance-brief': {
    category: 'daily',
    title: '每日财经简报',
    time: '07:45',
  },
  'iran-situation': {
    category: 'daily',
    title: '伊朗局势简报',
    time: '08:00',
  },
  'ai-news-brief': {
    category: 'daily',
    title: 'AI新闻简报',
    time: '08:00',
  },
  'midday-market-review': {
    category: 'market',
    title: 'A股港股午盘点评',
    time: '12:00',
  },
  'closing-market-review': {
    category: 'market',
    title: 'A股港股收盘点评',
    time: '16:00',
  },
  'industry-view-tracking': {
    category: 'fund',
    title: '行业观点跟踪',
    time: '17:00',
  },
  'fund-daily-tracking': {
    category: 'fund',
    title: '基金追踪日报',
    time: '20:00',
  },
  'trump-tweets-monitor': {
    category: 'monitor',
    title: '特朗普推文监控',
    time: '实时',
  },
};

/**
 * 生成报告文件
 * @param {string} reportType - 报告类型
 * @param {string} content - Markdown 内容
 * @param {string} summary - 摘要（可选，会自动从内容提取）
 */
function generateReport(reportType, content, summary = null) {
  const config = REPORT_TYPES[reportType];
  if (!config) {
    throw new Error(`未知的报告类型: ${reportType}`);
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
  const slug = `${dateStr}-${reportType}-${timeStr}`;
  
  // 提取摘要（如果没有提供）
  if (!summary) {
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
    summary = lines.slice(0, 2).join(' ').slice(0, 150);
    if (summary.length >= 150) summary += '...';
  }

  // 构建 frontmatter
  const frontmatter = `---
title: ${config.title} | ${dateStr.replace(/-/g, '年').replace(/-/, '月').replace(/-/, '日')}
date: ${now.toISOString()}
summary: ${summary}
category: ${config.category}
---

`;

  // 确保目录存在
  const contentDir = path.join(process.cwd(), 'content', config.category);
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // 写入文件
  const filePath = path.join(contentDir, `${slug}.md`);
  fs.writeFileSync(filePath, frontmatter + content);

  return {
    slug,
    category: config.category,
    title: config.title,
    date: now.toISOString(),
    summary,
    filePath,
  };
}

/**
 * 生成推送消息
 * @param {object} report - 报告信息
 * @param {string} baseUrl - 网站基础 URL
 */
function generatePushMessage(report, baseUrl = 'https://yourusername.github.io/finance-reports') {
  const url = `${baseUrl}/${report.category}/${report.slug}`;
  
  return `📊 **${report.title}**

${report.summary}

🔗 查看详情: ${url}

---
*生成时间: ${new Date(report.date).toLocaleString('zh-CN')}*`;
}

// 命令行调用
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('用法: node generate-report.js <reportType> <contentFile> [summary]');
    console.error('');
    console.error('可用的报告类型:');
    Object.keys(REPORT_TYPES).forEach(type => {
      console.error(`  - ${type}: ${REPORT_TYPES[type].title}`);
    });
    process.exit(1);
  }

  const [reportType, contentFile, summary] = args;
  const content = fs.readFileSync(contentFile, 'utf8');
  
  const report = generateReport(reportType, content, summary);
  console.log(JSON.stringify(report, null, 2));
}

module.exports = { generateReport, generatePushMessage, REPORT_TYPES };
