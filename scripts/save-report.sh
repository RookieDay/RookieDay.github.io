#!/bin/bash
# 报告生成脚本
# 用法: ./save-report.sh <category> <title> <summary> <content_file>

set -e

CATEGORY=$1
TITLE=$2
SUMMARY=$3
CONTENT_FILE=$4

if [ -z "$CATEGORY" ] || [ -z "$TITLE" ] || [ -z "$SUMMARY" ] || [ -z "$CONTENT_FILE" ]; then
    echo "用法: $0 <category> <title> <summary> <content_file>"
    echo "category: market, daily, fund, monitor"
    exit 1
fi

REPO_DIR="$HOME/.qclaw/workspace/finance-reports"
CONTENT_DIR="$REPO_DIR/content/$CATEGORY"

# 确保目录存在
mkdir -p "$CONTENT_DIR"

# 生成文件名
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M)
SLUG="${DATE}-${TIME}"
FILE="$CONTENT_DIR/${SLUG}.md"

# 生成frontmatter
DATETIME=$(date -Iseconds)

cat > "$FILE" << EOF
---
title: $TITLE
date: $DATETIME
summary: $SUMMARY
---

EOF

# 追加内容
cat "$CONTENT_FILE" >> "$FILE"

echo "报告已保存: $FILE"
echo "URL: /$CATEGORY/$SLUG"

# 如果是vercel项目目录，触发重新构建
if [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR"
    git add -A
    git commit -m "Add report: $TITLE" || true
    git push || true
fi
