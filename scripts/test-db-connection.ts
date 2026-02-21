import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from '@/lib/db';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
  try {
    console.log('Testing Prisma connection...');
    const user = await prisma.user.findFirst();
    console.log('✅ Connected successfully to PostgreSQL!');
    console.log('Sample user:', user || 'No users yet');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
