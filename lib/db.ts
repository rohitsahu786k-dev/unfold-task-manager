import 'dotenv/config'
import { PrismaClient } from '../prisma/generated'
import { PrismaNeon } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Configure your Neon PostgreSQL connection in .env.local')
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to Neon PostgreSQL via Neon Adapter')
  } catch (error) {
    console.error('❌ Failed to connect to Neon PostgreSQL:', error)
    throw error
  }
}

export default prisma
