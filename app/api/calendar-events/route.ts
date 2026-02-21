import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { getCalendarEvents, CalendarEventFormatted } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('google_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Google' },
        { status: 401 }
      );
    }

    // Create an OAuth2 client with the access token
    const oauth2Client = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    // Get calendar events
    const events = await getCalendarEvents(oauth2Client);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('google_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Google' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Create an OAuth2 client with the access token
    const oauth2Client = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    // Validate the request body
    if (!body.summary || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: 'Missing required fields: summary, startTime, endTime' },
        { status: 400 }
      );
    }

    const { google } = require('googleapis');
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const eventBody: any = {
      summary: body.summary,
      description: body.description,
      start: {
        dateTime: new Date(body.startTime).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(body.endTime).toISOString(),
        timeZone: 'UTC',
      },
    };

    if (body.attendees && body.attendees.length > 0) {
      eventBody.attendees = body.attendees.map((email: string) => ({ email }));
    }

    if (body.conferenceData) {
      eventBody.conferenceData = {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: {
            key: 'hangoutsMeet',
          },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventBody,
      conferenceDataVersion: body.conferenceData ? 1 : 0,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}
