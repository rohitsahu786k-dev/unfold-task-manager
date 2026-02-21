import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ 
      message: 'Database initialization completed',
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    }, { status: 500 });
  }
}
