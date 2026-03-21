/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages 部署配置
  // 如果仓库名不是 username.github.io，需要设置 basePath
  // basePath: '/finance-reports',
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
}

module.exports = nextConfig
