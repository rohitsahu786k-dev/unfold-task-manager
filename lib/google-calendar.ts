import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  status: string;
  htmlLink: string;
  conferenceData?: {
    entryPoints?: Array<{
      uri?: string;
      entryPointType?: string;
      label?: string;
    }>;
    conferenceId?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: string;
  }>;
}

export interface CalendarEventFormatted {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'google_calendar' | 'google_meet';
  color: string;
  url?: string;
  meetUrl?: string;
  description?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    status: string;
  }>;
  isPast: boolean;
}

export async function getCalendarEvents(
  authClient: OAuth2Client,
  calendarId: string = 'primary'
): Promise<CalendarEventFormatted[]> {
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const now = new Date();
  const formattedEvents: CalendarEventFormatted[] = [];

  try {
    const response = await calendar.events.list({
      calendarId,
      timeZone: 'UTC',
      maxResults: 50,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    events.forEach((event) => {
      if (event.id && event.summary && event.status === 'confirmed') {
        const startDateTime = event.start?.dateTime || event.start?.date;
        const endDateTime = event.end?.dateTime || event.end?.date;

        if (startDateTime) {
          const startDate = new Date(startDateTime);
          const endDate = endDateTime ? new Date(endDateTime) : startDate;
          const isPast = endDate < now;

          const formattedEvent: CalendarEventFormatted = {
            id: event.id,
            title: event.summary,
            date: startDate.toISOString().split('T')[0],
            startTime: startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            endTime: endDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            type: event.conferenceData?.entryPoints ? 'google_meet' : 'google_calendar',
            color: '#3b82f6',
            url: event.htmlLink || undefined,
            meetUrl: event.conferenceData?.entryPoints?.[0]?.uri || undefined,
            description: event.description || undefined,
            attendees: event.attendees?.map(att => ({
              email: att.email || '',
              name: att.displayName || att.email || '',
              status: att.responseStatus || '',
            })),
            isPast,
          };

          formattedEvents.push(formattedEvent);
        }
      }
    });

    return formattedEvents.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

export async function createCalendarEvent(
  authClient: OAuth2Client,
  event: {
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendees?: string[];
    conferenceData?: boolean;
  },
  calendarId: string = 'primary'
) {
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  try {
    const eventBody: any = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: 'UTC',
      },
    };

    if (event.attendees && event.attendees.length > 0) {
      eventBody.attendees = event.attendees.map(email => ({ email }));
    }

    if (event.conferenceData) {
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
      calendarId,
      requestBody: eventBody,
      conferenceDataVersion: event.conferenceData ? 1 : 0,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

export async function getMeetingDetails(
  authClient: OAuth2Client,
  eventId: string,
  calendarId: string = 'primary'
) {
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  try {
    const response = await calendar.events.get({
      calendarId,
      eventId,
    });

    const event = response.data as GoogleCalendarEvent;

    return {
      title: event.summary,
      meetUrl: event.conferenceData?.entryPoints?.[0]?.uri,
      description: event.description,
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      attendees: event.attendees?.map(att => ({
        email: att.email,
        name: att.displayName || att.email,
        status: att.responseStatus,
      })),
    };
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    throw error;
  }
}
