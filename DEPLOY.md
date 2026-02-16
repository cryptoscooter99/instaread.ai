# DocuParse AI - Deployment Guide

## Pre-Flight Checklist

### 1. Domain (Porkbun)
- [ ] Purchase domain: `docuparse.ai` or similar
- [ ] Point nameservers to Cloudflare

### 2. Cloudflare
- [ ] Add domain to Cloudflare
- [ ] Create A record pointing to Vercel (76.76.21.21)
- [ ] Enable SSL (Full/Strict)
- [ ] Set up Page Rules if needed

### 3. Vercel Setup
- [ ] Create new project
- [ ] Import from GitHub
- [ ] Add environment variables:
  ```
  POSTGRES_PRISMA_URL=
  POSTGRES_URL_NON_POOLING=
  NEXTAUTH_URL=https://yourdomain.com
  NEXTAUTH_SECRET=
  GITHUB_ID=
  GITHUB_SECRET=
  STRIPE_PUBLISHABLE_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_WEBHOOK_SECRET=
  OPENAI_API_KEY=
  BLOB_READ_WRITE_TOKEN=
  ```

### 4. Database (Vercel Postgres)
- [ ] Create Postgres database in Vercel
- [ ] Copy connection strings to env vars
- [ ] Run `npx prisma db push`

### 5. Stripe
- [ ] Create Stripe account
- [ ] Get API keys
- [ ] Create products:
  - Pro: $29/month
  - Business: $79/month
- [ ] Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Copy webhook secret

### 6. Auth (GitHub OAuth)
- [ ] Go to GitHub Settings → Developer Settings → OAuth Apps
- [ ] New OAuth App
- [ ] Callback URL: `https://yourdomain.com/api/auth/callback/github`
- [ ] Copy Client ID and Secret

### 7. Vercel Blob
- [ ] Enable in Vercel dashboard
- [ ] Copy token

### 8. OpenAI
- [ ] Get API key from platform.openai.com
- [ ] Set up usage limits to control costs

## Deployment Commands

```bash
# Local development
npm run dev

# Deploy to production
vercel --prod

# Database migrations
npx prisma db push
npx prisma studio
```

## Post-Deployment

- [ ] Test signup flow
- [ ] Test document upload
- [ ] Test Stripe checkout
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure custom domain in Vercel

## Cost Estimate (Monthly)

| Service | Cost |
|---------|------|
| Vercel Pro | $20 |
| Vercel Postgres | $0 (start) → $15+ |
| OpenAI API | ~$20 (estimated) |
| Stripe | 2.9% + 30¢ per transaction |
| Domain | ~$10/year |
| **Total Fixed** | **~$40-60/mo** |

## Revenue Target

Break-even: ~2 customers at $29/mo
Profit: 10 customers = $290/mo revenue - $60 costs = **$230/mo profit**
