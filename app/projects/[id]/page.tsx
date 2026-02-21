'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { useAuth } from '@/app/context/AuthContext';
import { useTaskComposer } from '@/app/context/TaskComposerContext';
import { MOCK_PROJECTS, MOCK_TASKS } from '@/app/types/mockData';
import {
  ChevronLeft,
  Users,
  FileText,
  MessageSquare,
  Lock,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'overview' | 'tasks' | 'technical_vault' | 'files' | 'meetings' | 'activity';

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { openComposer } = useTaskComposer();
  const projectId = params.id;

  const project = MOCK_PROJECTS.find((p) => p.id === projectId);
  const projectTasks = MOCK_TASKS.filter((t) => t.project_id === projectId);

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <Clock className="h-4 w-4" /> },
    { id: 'technical_vault', label: 'Technical Vault', icon: <Lock className="h-4 w-4" /> },
    { id: 'files', label: 'Files', icon: <FileText className="h-4 w-4" /> },
    { id: 'meetings', label: 'Meetings', icon: <Users className="h-4 w-4" /> },
    { id: 'activity', label: 'Activity Log', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout>
      {/* Header with Back Button */}
      <div className="mb-8">
        <Link href="/projects" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">Back to Projects</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-2 text-gray-600">{project.requirement_notes}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
              project.status === 'pending_intake' ? 'bg-yellow-100 text-yellow-700' :
              project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
              project.status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {project.status.replace(/_/g, ' ')}
            </span>
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
              project.priority === 'urgent' ? 'bg-red-100 text-red-700' :
              project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {project.priority}
            </span>
          </div>
        </div>

        {/* Key Info Bar */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Client</p>
            <p className="font-semibold text-gray-900 mt-1">Design Co.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Deadline</p>
            <p className="font-semibold text-gray-900 mt-1">{new Date(project.deadline).toLocaleDateString()}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Manager</p>
            <p className="font-semibold text-gray-900 mt-1">{project.assigned_manager || 'Unassigned'}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Project Type</p>
                  <p className="font-medium text-gray-900 mt-1">{project.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pricing Model</p>
                  <p className="font-medium text-gray-900 mt-1">{project.pricing_model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agency</p>
                  <p className="font-medium text-gray-900 mt-1">{project.agency_id}</p>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h3>
              <p className="text-gray-700">{project.internal_notes || 'No notes added yet'}</p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall</span>
                    <span className="text-sm font-bold text-gray-900">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total Tasks</span>
                  <span className="font-bold text-gray-900">{projectTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">In Progress</span>
                  <span className="font-bold text-blue-600">{projectTasks.filter(t => t.status === 'in_progress').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Completed</span>
                  <span className="font-bold text-green-600">{projectTasks.filter(t => t.status === 'completed').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
            <button
              onClick={openComposer}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              + Add Task
            </button>
          </div>

          <div className="space-y-3">
            {projectTasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{task.description.substring(0, 60)}...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    {task.review_required && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">Requires Review</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    task.status === 'sent_for_review' ? 'bg-yellow-100 text-yellow-700' :
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'technical_vault' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Vault</h3>

          {currentUser.role === 'developer' ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Access restricted. Contact your manager for access.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Temporary Domain</label>
                  <p className="mt-1 text-gray-900">temp-domain-123.dev</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Live Domain</label>
                  <p className="mt-1 text-gray-900">project-domain.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hosting</label>
                  <p className="mt-1 text-gray-900">AWS - Region: us-east-1</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Technical Notes</label>
                  <p className="mt-1 text-gray-700">Database: PostgreSQL 14.2, Cache: Redis, CDN: CloudFlare</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'files' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Files</h3>
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No files uploaded yet</p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600">
              + Upload File
            </button>
          </div>
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Meetings</h3>
          <div className="space-y-3">
            {[
              { title: 'Weekly Sync', date: '2026-02-19', time: '10:00 AM' },
              { title: 'Client Call', date: '2026-02-21', time: '2:00 PM' },
            ].map((meeting, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{meeting.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{meeting.date} at {meeting.time}</p>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Log</h3>
          <div className="space-y-3">
            {[
              { action: 'Project created', user: 'Sarah Chen', time: '2 hours ago' },
              { action: 'Task assigned to Alex Kumar', user: 'Emily Watson', time: '1 day ago' },
              { action: 'Status changed to In Progress', user: 'Emily Watson', time: '2 days ago' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-600 mt-1">by {log.user} · {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
