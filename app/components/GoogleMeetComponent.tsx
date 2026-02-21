'use client';

import { Video, Users, Calendar, Clock, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface GoogleMeetComponent {
  meetUrl?: string;
  title: string;
  startTime?: string;
  endTime?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    status: string;
  }>;
  description?: string;
}

export default function GoogleMeetComponent({
  meetUrl,
  title,
  startTime,
  endTime,
  attendees = [],
  description,
}: GoogleMeetComponent) {
  const [copied, setCopied] = useState(false);

  const handleCopyMeetUrl = () => {
    if (meetUrl) {
      navigator.clipboard.writeText(meetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinMeeting = () => {
    if (meetUrl) {
      window.open(meetUrl, '_blank');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 rounded-lg">
          <Video className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}

          {/* Meeting Details */}
          <div className="mt-4 space-y-3">
            {startTime && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-red-600" />
                <span>{startTime}</span>
                {endTime && <span>- {endTime}</span>}
              </div>
            )}

            {/* Attendees */}
            {attendees.length > 0 && (
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-2 text-gray-700">
                  <Users className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Attendees ({attendees.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2 ml-6">
                  {attendees.slice(0, 3).map((attendee, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-gray-600"
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
                    <div className="text-xs text-gray-600 italic">
                      +{attendees.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Meet Link */}
          {meetUrl && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                <LinkIcon className="h-4 w-4" />
                Google Meet Link
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={meetUrl}
                  readOnly
                  className="flex-1 text-xs bg-transparent text-blue-600 truncate"
                />
                <button
                  onClick={handleCopyMeetUrl}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Join Button */}
          {meetUrl && (
            <button
              onClick={handleJoinMeeting}
              className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <Video className="h-4 w-4" />
              Join Google Meet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
