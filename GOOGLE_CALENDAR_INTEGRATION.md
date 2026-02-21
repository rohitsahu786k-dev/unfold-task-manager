# Google Calendar and Google Meet Integration

## Overview
This integration enables users to view their Google Calendar events and Google Meet meetings directly within the application's calendar page. Users can see all their past meetings and scheduled events, with the ability to directly join Google Meet calls.

## Features Implemented

### 1. **Google OAuth 2.0 Authentication**
- Users can authenticate with their Google account
- Secure token management with httpOnly cookies
- Automatic token refresh capability

### 2. **Google Calendar Integration**
- View all calendar events from the primary Google Calendar
- Display events with full details (title, description, attendees, time)
- Show up to 50 calendar events sorted by date
- Support for both upcoming and past events
- Color-coded event display (blue for calendar, red for Google Meet)

### 3. **Google Meet Integration**
- Detect and display Google Meet conference links
- Direct join links for video meetings
- Attendee information with response status
- Meeting time and duration display

### 4. **Calendar Page Enhancement**
- Dedicated Google authentication button
- Real-time event synchronization
- Integrated filters for Google Calendar and Google Meet events
- Connection status indicator
- Error handling and user feedback

## Configuration

### Environment Variables
The following variables are configured in `.env.local`:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]
GOOGLE_API_KEY=[YOUR_GOOGLE_API_KEY]
NEXT_PUBLIC_GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

**Note**: The `NEXT_PUBLIC_` prefix indicates variables that are exposed to the browser. The `GOOGLE_CLIENT_SECRET` is kept private on the server side.

## API Endpoints

### 1. **GET /api/auth/google/login**
Returns the Google OAuth authorization URL.

**Response**:
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### 2. **GET /api/auth/google/callback**
Handles the OAuth callback after user authorization. Exchanges authorization code for tokens and sets secure cookies.

**Query Parameters**:
- `code`: Authorization code from Google
- `error` (optional): Error message if authorization failed

**Redirects to**: `/calendar?google_authenticated=true`

### 3. **GET /api/calendar-events**
Retrieves calendar events from Google Calendar. Requires authentication (access token in cookies).

**Response**:
```json
{
  "events": [
    {
      "id": "event_id",
      "title": "Meeting Title",
      "date": "2026-02-19",
      "startTime": "2:30 PM",
      "endTime": "3:30 PM",
      "type": "google_calendar|google_meet",
      "color": "#3b82f6",
      "url": "https://calendar.google.com/...",
      "meetUrl": "https://meet.google.com/...",
      "description": "Event description",
      "attendees": [
        {
          "email": "user@example.com",
          "name": "User Name",
          "status": "accepted|declined|needsAction"
        }
      ],
      "isPast": false
    }
  ]
}
```

### 4. **POST /api/calendar-events**
Creates a new Google Calendar event (requires authentication).

**Request Body**:
```json
{
  "summary": "Event Title",
  "description": "Event description",
  "startTime": "2026-02-20T14:00:00Z",
  "endTime": "2026-02-20T15:00:00Z",
  "attendees": ["email1@example.com", "email2@example.com"],
  "conferenceData": true
}
```

**Response**:
Returns the created event object from Google Calendar API.

## Core Libraries

### Google APIs
- **google-auth-library** (v9.4.1): OAuth 2.0 authentication
- **googleapis** (v139.0.0): Google Calendar and Meet APIs

These libraries provide the client and server-side functionality for OAuth authentication and API communication.

## File Structure

```
lib/
├── google-oauth.ts              # OAuth client setup and token management
├── google-calendar.ts           # Calendar API integration and event formatting
└── google-*                      # Other Google integrations

app/api/
├── auth/google/
│   ├── login/route.ts          # OAuth login initiation
│   └── callback/route.ts        # OAuth callback handler
└── calendar-events/
    └── route.ts                 # Calendar event retrieval and creation

app/context/
└── AuthContext.tsx              # Authentication context with Google integration

app/components/
├── GoogleMeetComponent.tsx       # Google Meet meeting display
└── GoogleCalendarEventComponent.tsx # Calendar event display

app/calendar/
└── page.tsx                      # Enhanced calendar page with Google integration
```

## Authentication Flow

1. **User clicks "Connect Google" button** on the calendar page
2. **Browser redirects to** `/api/auth/google/login`
3. **API returns** Google OAuth authorization URL
4. **User is redirected to** Google login/consent screen
5. **After authorization, Google redirects to** `/auth/google/callback`
6. **Callback route exchanges code for tokens** and stores them in secure cookies
7. **User is redirected to** `/calendar?google_authenticated=true`
8. **AuthContext detects** the authentication parameter and sets `isGoogleAuthenticated` to true
9. **Calendar component fetches** events from Google Calendar API

## Using the Integration

### Viewing Google Calendar Events
1. Navigate to the Calendar page
2. Click "Connect Google" button
3. Complete Google authentication
4. Calendar will automatically load your Google Calendar events
5. Use filters to show/hide Google Calendar and Google Meet events
6. Click on any event to view details or join a meeting

### Event Display
- **Google Calendar Events**: Displayed in blue
- **Google Meet Meetings**: Displayed in red with a video icon
- **Past Events**: Marked as past with appropriate styling
- **Upcoming Events**: Shown in the upcoming events list

### Filters
- **Google Calendar**: Toggle to show/hide calendar events
- **Google Meet**: Toggle to show/hide video meeting events
- Other filters (Projects, Tasks, Meetings) remain available

## Security Considerations

1. **Token Security**
   - Access tokens are stored in httpOnly cookies (inaccessible to JavaScript)
   - Secure flag is set for production (HTTPS only)
   - Tokens are automatically cleared on browser close or expiration

2. **Credential Storage**
   - Client Secret is stored only on the server
   - Never exposed to the client-side code
   - OAuth tokens are revoked if needed

3. **Scope Limiting**
   - Calendar: `https://www.googleapis.com/auth/calendar.readonly` (read-only)
   - Meet: `https://www.googleapis.com/auth/meet.readonly` (read-only)
   - Create Calendar events: `https://www.googleapis.com/auth/calendar` (required for POST requests)

## Error Handling

The application handles various error scenarios:
- **Authentication Failures**: User is notified with error message
- **Network Errors**: Graceful fallback to mock data
- **Permission Issues**: Clear error message about required permissions
- **Token Expiration**: Automatic refresh handled by OAuth2Client

## Future Enhancements

1. **Advanced Features**
   - Create and edit calendar events directly from the app
   - Manage attendees and send invitations
   - Set reminders and notifications
   - Sync with multiple calendars

2. **GoogleMeet Enhancements**
   - Pre-meeting setup (camera/microphone check)
   - Share screen capability detection
   - Record meeting information
   - Waiting room management

3. **Integration Improvements**
   - Timezone support
   - Recurring event handling
   - Calendar sharing and delegation
   - Attachment and file sharing

## Troubleshooting

### "Not authenticated with Google" Error
- Click "Connect Google" button again
- Ensure cookies are enabled in your browser
- Check if the callback URL matches the one in Google Cloud Console

### Missing Calendar Events
- Verify read permissions are granted
- Check Google Calendar visibility settings
- Ensure the event date range is within the last 30 days
- Some calendars may require explicit permissions

### Google Meet Link Not Showing
- Ensure the event has a Google Meet conference
- Check that the event was created with "Add video conferencing" option
- Verify the Google Meet permissions are granted

## Support & Contact

For issues or feature requests related to Google Calendar integration, please refer to:
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Google Meet API Documentation](https://developers.google.com/meet)
- [OAuth 2.0 Best Practices](https://developers.google.com/identity/protocols/oauth2)
