'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_MEETINGS } from '../types/mockData';
import { ChevronLeft, ChevronRight, Calendar, Clock, Briefcase, Users, Filter, LogIn, CheckCircle, Video } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'project' | 'task' | 'meeting' | 'google_calendar' | 'google_meet';
  color: string;
  url?: string;
  meetUrl?: string;
  metadata?: string;
  startTime?: string;
  endTime?: string;
  isPast?: boolean;
}

export default function CalendarPage() {
  const { currentUser, isGoogleAuthenticated, googleLoginUrl } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 18)); // Feb 18, 2026
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [filters, setFilters] = useState({
    projects: true,
    tasks: true,
    meetings: true,
    google_calendar: true,
    google_meet: true,
  });
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  // Fetch Google Calendar events
  useEffect(() => {
    if (isGoogleAuthenticated) {
      fetchGoogleCalendarEvents();
    }
  }, [isGoogleAuthenticated]);

  const fetchGoogleCalendarEvents = async () => {
    setLoadingGoogle(true);
    try {
      const response = await fetch('/api/calendar-events');
      if (response.ok) {
        const { events } = await response.json();
        const formattedEvents: CalendarEvent[] = events.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          type: event.type === 'google_meet' ? 'google_meet' : 'google_calendar',
          color: event.type === 'google_meet' 
            ? 'bg-red-100 border-red-300 text-red-700' 
            : 'bg-blue-100 border-blue-300 text-blue-700',
          url: event.url,
          meetUrl: event.meetUrl,
          metadata: event.startTime ? `${event.startTime} - ${event.endTime}` : undefined,
          startTime: event.startTime,
          endTime: event.endTime,
          isPast: event.isPast,
        }));
        setGoogleEvents(formattedEvents);
      } else {
        setGoogleAuthError('Failed to fetch Google Calendar events');
      }
    } catch (error) {
      console.error('Error fetching Google events:', error);
      setGoogleAuthError('Error loading Google events');
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Get visible data based on user role
  const getVisibleProjects = () => {
    if (currentUser.role === 'agency_user') {
      return MOCK_PROJECTS.filter(p => p.agency_id === currentUser.agency_id);
    }
    return MOCK_PROJECTS;
  };

  const getVisibleTasks = () => {
    if (currentUser.role === 'developer') {
      return MOCK_TASKS.filter(t => t.assigned_to === currentUser.id);
    }
    return MOCK_TASKS;
  };

  // Generate events for calendar
  const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Add project deadlines
    if (filters.projects) {
      getVisibleProjects().forEach(project => {
        events.push({
          id: `proj_${project.id}`,
          title: `Project: ${project.name}`,
          date: project.deadline,
          type: 'project',
          color: 'bg-blue-100 border-blue-300 text-blue-700',
          url: `/projects/${project.id}`,
          metadata: project.status,
        });
      });
    }

    // Add task deadlines
    if (filters.tasks) {
      getVisibleTasks().forEach(task => {
        events.push({
          id: `task_${task.id}`,
          title: `Task: ${task.title}`,
          date: task.deadline,
          type: 'task',
          color: 'bg-green-100 border-green-300 text-green-700',
          url: `/tasks/${task.id}`,
          metadata: task.status,
        });
      });
    }

    // Add meetings
    if (filters.meetings) {
      MOCK_MEETINGS.forEach(meeting => {
        const scheduledDate = new Date(meeting.scheduled_at);
        const dateStr = scheduledDate.toISOString().split('T')[0];
        events.push({
          id: `meet_${meeting.id}`,
          title: `Meeting: ${meeting.title}`,
          date: dateStr,
          type: 'meeting',
          color: 'bg-purple-100 border-purple-300 text-purple-700',
          metadata: scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        });
      });
    }

    // Add Google Calendar events
    if (filters.google_calendar) {
      googleEvents
        .filter(e => e.type === 'google_calendar')
        .forEach(event => {
          events.push(event);
        });
    }

    // Add Google Meet events
    if (filters.google_meet) {
      googleEvents
        .filter(e => e.type === 'google_meet')
        .forEach(event => {
          events.push(event);
        });
    }

    return events;
  };

  const events = generateEvents();

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date.startsWith(dateStr));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 1, 18)); // Feb 18, 2026
  };

  const handleGoogleLogin = () => {
    if (googleLoginUrl) {
      window.location.href = googleLoginUrl;
    }
  };

  // Generate calendar grid
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Calendar
        </h1>
        <p className="mt-2 text-gray-600">View your projects, tasks, meetings, and Google Calendar events</p>
      </div>

      {/* Google Authentication Status */}
      <div className="mb-6">
        {isGoogleAuthenticated ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Google Calendar Connected</p>
              <p className="text-sm text-green-700">Showing your Google Calendar and Google Meet events</p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Connect Google Calendar</p>
                <p className="text-sm text-blue-700">View your Google Calendar events and Google Meet meetings</p>
              </div>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <LogIn className="h-4 w-4" />
              Connect Google
            </button>
          </div>
        )}
        {googleAuthError && (
          <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
            {googleAuthError}
          </div>
        )}
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), day) : [];
              const isToday = day === 18 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026;

              return (
                <div
                  key={idx}
                  className={`min-h-32 p-2 border border-gray-200 ${
                    day ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'bg-green-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-green-700' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <a
                            key={event.id}
                            href={event.url || event.meetUrl || '#'}
                            target={event.meetUrl ? '_blank' : undefined}
                            rel={event.meetUrl ? 'noopener noreferrer' : undefined}
                            className={`text-xs p-1.5 rounded border cursor-pointer block line-clamp-2 hover:shadow-md transition-shadow ${event.color}`}
                            title={event.title}
                          >
                            <div className="flex items-center gap-1">
                              {event.type === 'google_meet' && <Video className="h-3 w-3 flex-shrink-0" />}
                              <span>{event.title.replace('Project: ', '').replace('Task: ', '').replace('Meeting: ', '')}</span>
                            </div>
                          </a>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-600 px-1.5">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filter Widget */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.projects}
                  onChange={(e) => setFilters(prev => ({ ...prev, projects: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded bg-blue-400" />
                  <span className="text-sm text-gray-700">Projects</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.tasks}
                  onChange={(e) => setFilters(prev => ({ ...prev, tasks: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded bg-green-400" />
                  <span className="text-sm text-gray-700">Tasks</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.meetings}
                  onChange={(e) => setFilters(prev => ({ ...prev, meetings: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded bg-purple-400" />
                  <span className="text-sm text-gray-700">Meetings</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.google_calendar}
                  onChange={(e) => setFilters(prev => ({ ...prev, google_calendar: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded bg-cyan-400" />
                  <span className="text-sm text-gray-700">Google Calendar</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.google_meet}
                  onChange={(e) => setFilters(prev => ({ ...prev, google_meet: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded bg-red-400" />
                  <span className="text-sm text-gray-700">Google Meet</span>
                </div>
              </label>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingGoogle && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Loading Google Calendar events...</p>
                </div>
              )}
              {events
                .filter(e => {
                  const eventDate = new Date(e.date);
                  const today = new Date(2026, 1, 18);
                  return eventDate >= today;
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 8)
                .map(event => (
                  <a
                    key={event.id}
                    href={event.meetUrl || event.url || '#'}
                    target={event.meetUrl ? '_blank' : undefined}
                    rel={event.meetUrl ? 'noopener noreferrer' : undefined}
                    className={`p-3 rounded-lg border-l-4 block hover:shadow-md transition-shadow ${event.color}`}
                  >
                    <div className="flex items-center gap-2">
                      {event.type === 'google_meet' && <Video className="h-4 w-4" />}
                      <p className="font-medium text-sm truncate">{event.title}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{new Date(event.date).toLocaleDateString()}</span>
                      {event.startTime && <span className="text-xs ml-2">{event.startTime}</span>}
                    </div>
                    {event.metadata && event.type !== 'google_calendar' && event.type !== 'google_meet' && (
                      <span className="text-xs mt-1 inline-block">{event.metadata}</span>
                    )}
                  </a>
                ))}
              {events.length === 0 && (
                <p className="text-sm text-gray-600 text-center py-8">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-700">Project Deadline</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-700">Task Deadline</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-700">Meeting</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-cyan-600" />
                <span className="text-xs text-gray-700">Google Calendar</span>
              </div>
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-red-600" />
                <span className="text-xs text-gray-700">Google Meet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
