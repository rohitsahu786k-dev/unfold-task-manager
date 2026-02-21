import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const redirectUrl = process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

// Validate environment variables
if (!clientId) {
  console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable');
}
if (!clientSecret) {
  console.error('Missing GOOGLE_CLIENT_SECRET environment variable');
}
if (!redirectUrl) {
  console.error('Missing NEXT_PUBLIC_GOOGLE_CALLBACK_URL environment variable');
}

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

export function getAuthUrl(scopes: string[]) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

export async function getTokensFromCode(code: string) {
  try {
    console.log('Getting tokens for code:', code.substring(0, 10) + '...');
    console.log('Client ID:', clientId.substring(0, 10) + '...');
    console.log('Redirect URL:', redirectUrl);
    
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens) {
      throw new Error('No tokens returned from Google');
    }
    
    console.log('Successfully obtained tokens');
    return tokens;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting tokens:', errorMessage);
    throw error;
  }
}

export function setCredentials(tokens: any) {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

export function getOAuth2Client() {
  return oauth2Client;
}

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
