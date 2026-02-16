/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@vercel/postgres'],
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
