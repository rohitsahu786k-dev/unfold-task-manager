'use client';

import { AlertCircle, Calendar, Users } from 'lucide-react';

interface ProjectContextSidebarProps {
  projectId: string;
}

const mockProjectData = {
  p1: {
    name: 'Website Redesign',
    client: 'Acme Corp',
    deadline: '2024-12-31',
    progress: 65,
    overdueCount: 2,
    meetings: [
      { id: 1, title: 'Design Review', date: '2024-02-20 10:00 AM' },
      { id: 2, title: 'Stakeholder Sync', date: '2024-02-22 2:00 PM' },
    ],
  },
  p2: {
    name: 'Mobile App Development',
    client: 'Tech Startup',
    deadline: '2024-06-30',
    progress: 40,
    overdueCount: 0,
    meetings: [
      { id: 3, title: 'Sprint Planning', date: '2024-02-21 9:00 AM' },
    ],
  },
  p3: {
    name: 'Database Migration',
    client: 'Enterprise Inc',
    deadline: '2024-03-15',
    progress: 85,
    overdueCount: 1,
    meetings: [
      { id: 4, title: 'Infrastructure Review', date: '2024-02-23 3:00 PM' },
    ],
  },
};

export default function ProjectContextSidebar({ projectId }: ProjectContextSidebarProps) {
  const projectData = projectId ? mockProjectData[projectId as keyof typeof mockProjectData] : null;

  return (
    <aside className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto sticky top-0 h-screen">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Context</h3>

      {projectData ? (
        <div className="space-y-4">
          {/* Project Info */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900">{projectData.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{projectData.client}</p>
          </div>

          {/* Deadline */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h5 className="text-sm font-medium text-gray-900">Deadline</h5>
            </div>
            <p className="text-sm text-gray-700 font-semibold">
              {new Date(projectData.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Progress */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">Project Progress</h5>
              <span className="text-sm font-bold text-green-600">{projectData.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${projectData.progress}%` }}
              />
            </div>
          </div>

          {/* Overdue Tasks */}
          {projectData.overdueCount > 0 && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-red-900">Overdue Tasks</h5>
                  <p className="text-sm text-red-800">{projectData.overdueCount} task{projectData.overdueCount !== 1 ? 's' : ''} need attention</p>
                </div>
              </div>
            </div>
          )}

          {/* Linked Meetings */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-gray-500" />
              <h5 className="text-sm font-medium text-gray-900">Linked Meetings</h5>
            </div>
            {projectData.meetings.length > 0 ? (
              <div className="space-y-2">
                {projectData.meetings.map((meeting) => (
                  <div key={meeting.id} className="rounded bg-white p-2.5 border border-gray-200">
                    <p className="text-xs font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{meeting.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No meetings linked</p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 p-4 border-2 border-dashed border-gray-300 text-center">
          <p className="text-sm text-gray-500">
            Select a project to view context
          </p>
        </div>
      )}
    </aside>
  );
}
