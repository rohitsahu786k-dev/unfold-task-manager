import { initializeDatabase } from '@/lib/init-db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await initializeDatabase();
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected to Neon PostgreSQL',
      database: 'neondb',
      databaseStatus: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
