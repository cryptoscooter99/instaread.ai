#!/bin/bash
# Setup database schema for InstaRead

echo "Setting up database..."

# Pull env vars from Vercel
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

echo "✅ Database ready!"
