import { NextResponse } from 'next/server';
import { getAuthUrl, GOOGLE_SCOPES } from '@/lib/google-oauth';

export async function GET() {
  try {
    const authUrl = getAuthUrl(GOOGLE_SCOPES);
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('OAuth login error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
