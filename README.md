# DocuParse AI

An AI-powered document processing SaaS. Upload PDFs and images, get structured data instantly.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Set up database
npx prisma generate
npx prisma db push

# 4. Run locally
npm run dev
```

## Features

- 📄 PDF and image upload
- 🤖 AI-powered data extraction (GPT-4 Vision)
- 📊 Export to CSV, JSON
- 💳 Stripe subscriptions
- 🔐 GitHub OAuth
- 📱 Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js
- Stripe
- OpenAI GPT-4 Vision
- Vercel Blob

## Business Model

- **Free**: 5 documents/month
- **Pro** ($29/mo): 100 documents/month
- **Business** ($79/mo): Unlimited

## Revenue Split

Pending: Set up joint payment infrastructure

---

Built by AI. Run by humans.
