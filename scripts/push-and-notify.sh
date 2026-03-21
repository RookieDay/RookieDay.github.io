#!/bin/bash
#
# 金融报告自动推送脚本
# 用于定时任务生成报告后自动推送到 GitHub 并发送微信通知
#

set -e

PROJECT_DIR="/Users/ht/.qclaw/workspace/finance-reports"
REPO_URL="https://github.com/RookieDay/RookieDay.github.io.git"
BASE_URL="https://rookieday.github.io"

# 进入项目目录
cd "$PROJECT_DIR"

# 检查是否有新的更改
if git diff --quiet && git diff --staged --quiet; then
    echo "No changes to commit"
    exit 0
fi

# 获取新增的文件列表
NEW_FILES=$(git status --porcelain | grep "^??" | awk '{print $2}')

if [ -z "$NEW_FILES" ]; then
    echo "No new files to commit"
    exit 0
fi

# 提交新报告
git add content/
git commit -m "Add new finance reports - $(date '+%Y-%m-%d %H:%M')"

# 推送到 GitHub
git push origin main

# 发送微信通知
for FILE in $NEW_FILES; do
    if [[ "$FILE" == content/*/*.md ]]; then
        # 解析文件路径
        CATEGORY=$(echo "$FILE" | cut -d'/' -f2)
        SLUG=$(basename "$FILE" .md)
        
        # 提取标题和摘要
        TITLE=$(grep "^title:" "$FILE" | sed 's/title: //')
        SUMMARY=$(grep "^summary:" "$FILE" | sed 's/summary: //')
        
        # 生成链接
        URL="${BASE_URL}/${CATEGORY}/${SLUG}/"
        
        # 输出通知内容（由调用方发送）
        echo "NOTIFY_START"
        echo "TITLE: $TITLE"
        echo "SUMMARY: $SUMMARY"
        echo "URL: $URL"
        echo "NOTIFY_END"
    fi
done

echo "Push completed at $(date)"
