'use client';

import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';

interface GoogleCalendarEventComponent {
  title: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    status: string;
  }>;
  url?: string;
  isPast?: boolean;
}

export default function GoogleCalendarEventComponent({
  title,
  startTime,
  endTime,
  description,
  location,
  attendees = [],
  url,
  isPast = false,
}: GoogleCalendarEventComponent) {
  return (
    <div
      className={`rounded-lg border ${
        isPast
          ? 'border-gray-200 bg-gray-50'
          : 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
      } p-6`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 ${
            isPast ? 'bg-gray-100' : 'bg-blue-100'
          } rounded-lg`}
        >
          <Calendar
            className={`h-6 w-6 ${
              isPast ? 'text-gray-600' : 'text-blue-600'
            }`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-lg font-semibold ${
                isPast ? 'text-gray-600' : 'text-gray-900'
              }`}
            >
              {title}
            </h3>
            {isPast && (
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                Past Event
              </span>
            )}
          </div>

          {description && (
            <p
              className={`text-sm ${
                isPast ? 'text-gray-600' : 'text-gray-700'
              } mt-1`}
            >
              {description}
            </p>
          )}

          {/* Event Details */}
          <div
            className={`mt-4 space-y-3 ${
              isPast ? 'text-gray-600' : 'text-gray-700'
            }`}
          >
            {startTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className={`h-4 w-4 ${isPast ? 'text-gray-400' : 'text-blue-600'}`} />
                <span>{startTime}</span>
                {endTime && <span>- {endTime}</span>}
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className={`h-4 w-4 ${isPast ? 'text-gray-400' : 'text-blue-600'}`} />
                <span>{location}</span>
              </div>
            )}

            {/* Attendees */}
            {attendees.length > 0 && (
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className={`h-4 w-4 ${isPast ? 'text-gray-400' : 'text-blue-600'}`} />
                  <span className="font-medium">Attendees ({attendees.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2 ml-6">
                  {attendees.slice(0, 3).map((attendee, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>{attendee.name || attendee.email}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          attendee.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : attendee.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {attendee.status}
                      </span>
                    </div>
                  ))}
                  {attendees.length > 3 && (
                    <div className={`text-xs ${isPast ? 'text-gray-500' : 'text-gray-600'} italic`}>
                      +{attendees.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View Event Button */}
          {url && (
            <button
              onClick={() => window.open(url, '_blank')}
              className={`mt-4 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                isPast
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ExternalLink className="h-4 w-4" />
              View in Google Calendar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
