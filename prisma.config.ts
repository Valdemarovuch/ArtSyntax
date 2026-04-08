import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Prisma CLI doesn't know about Next.js – load .env.local manually
config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use direct connection (no pgbouncer) for Prisma CLI migrations/push
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
})
