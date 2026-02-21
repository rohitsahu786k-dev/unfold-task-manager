import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode } from '@/lib/google-oauth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
      const errorMessage = error_description ? `${error}: ${error_description}` : error;
      console.error('Google OAuth error:', errorMessage);
      return NextResponse.redirect(
        new URL(`/calendar?error=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(
        new URL('/calendar?error=No authorization code received', request.url)
      );
    }

    console.log('Exchanging authorization code for tokens...');
    
    // Exchange the authorization code for tokens
    const tokens = await getTokensFromCode(code);

    console.log('Tokens received successfully');

    // Store tokens in a secure way (could use httpOnly cookies or session storage)
    // For now, we'll redirect with a flag that tokens are available
    const response = NextResponse.redirect(new URL('/calendar?google_authenticated=true', request.url));

    // Store the access token and refresh token in memory/session
    // You might want to store this in a database associated with the user
    response.cookies.set('google_access_token', tokens.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expiry_date
        ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
        : 3600,
    });

    if (tokens.refresh_token) {
      response.cookies.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('OAuth callback error:', errorMessage);
    return NextResponse.redirect(
      new URL(`/calendar?error=${encodeURIComponent('Authentication failed: ' + errorMessage)}`, request.url)
    );
  }
}
