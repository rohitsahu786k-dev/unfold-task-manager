'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { MOCK_TASKS, MOCK_PROJECTS } from '../types/mockData';
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

type FilterType = 'active' | 'review' | 'completed';

export default function TasksPage() {
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
  
  // Get user's tasks
  const allTasks = currentUser.role === 'developer' 
    ? MOCK_TASKS.filter(t => t.assigned_to === currentUser.id)
    : MOCK_TASKS.filter(t => t.assigned_by === currentUser.id);

  // Filter tasks by status
  const activeTasks = allTasks.filter(t => 
    ['not_started', 'in_progress', 'blocked', 'waiting'].includes(t.status)
  );

  const reviewTasks = allTasks.filter(t => t.status === 'sent_for_review');
  
  const completedTasks = allTasks.filter(t => t.status === 'completed').sort((a, b) => {
    const dateA = new Date(a.completed_at || '').getTime();
    const dateB = new Date(b.completed_at || '').getTime();
    return dateB - dateA;
  }).slice(0, 20);

  const filterTabs = [
    { id: 'active', label: 'Active', count: activeTasks.length, icon: <Clock className="h-4 w-4" /> },
    { id: 'review', label: 'Sent for Review', count: reviewTasks.length, icon: <Eye className="h-4 w-4" /> },
    { id: 'completed', label: 'Completed', count: completedTasks.length, icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const getTaskProject = (projectId: string) => {
    return MOCK_PROJECTS.find(p => p.id === projectId);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const TaskCard = ({ task }: { task: typeof allTasks[0] }) => {
    const project = getTaskProject(task.project_id);
    const overdue = isOverdue(task.deadline);

    return (
      <div className={`rounded-lg border p-4 transition-all hover:shadow-md ${
        overdue && task.status !== 'completed' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            {project && (
              <p className="text-sm text-gray-600 mt-1">Project: {project.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {task.review_required && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                Review Required
              </span>
            )}
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
              task.status === 'sent_for_review' ? 'bg-yellow-100 text-yellow-700' :
              task.status === 'completed' ? 'bg-green-100 text-green-700' :
              task.status === 'blocked' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {task.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-3 pb-3 border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
            {task.estimated_hours && (
              <span>{task.estimated_hours}h estimated</span>
            )}
          </div>
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {task.priority}
          </span>
        </div>

        {/* Action Buttons */}
        {task.status !== 'completed' && (
          <div className="flex gap-2">
            {task.status === 'sent_for_review' && (
              <div className="text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg flex-1">
                ⏳ Awaiting approval from manager
              </div>
            )}
            {task.status !== 'sent_for_review' && (
              <>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex-1">
                  View
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex-1">
                  Update
                </button>
                {task.status !== 'blocked' && (
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors flex-1">
                    Submit for Review
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Completed Badge */}
        {task.status === 'completed' && (
          <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            ✓ Completed on {task.completed_at ? new Date(task.completed_at).toLocaleDateString() : 'N/A'}
          </div>
        )}

        {/* Overdue Warning */}
        {overdue && task.status !== 'completed' && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>This task is overdue! Please prioritize.</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="mt-2 text-gray-600">
          {currentUser.role === 'developer' 
            ? 'View and manage your assigned tasks' 
            : 'View tasks you have assigned'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 border-b border-gray-200">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterType)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeFilter === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {activeFilter === 'active' && (
          <>
            {activeTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600">All tasks completed! Great work!</p>
              </div>
            ) : (
              <>
                {/* Overdue Tasks First */}
                {activeTasks.some(t => isOverdue(t.deadline)) && (
                  <>
                    <h3 className="font-semibold text-red-700 text-sm uppercase px-1 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Overdue
                    </h3>
                    <div className="space-y-3 mb-6">
                      {activeTasks.filter(t => isOverdue(t.deadline)).map(task => (
                        <Link key={task.id} href={`/tasks/${task.id}`}>
                          <TaskCard task={task} />
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* Upcoming Tasks */}
                <h3 className="font-semibold text-gray-900 text-sm uppercase px-1 mb-2">Upcoming</h3>
                <div className="space-y-3">
                  {activeTasks.filter(t => !isOverdue(t.deadline)).map(task => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <TaskCard task={task} />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeFilter === 'review' && (
          <>
            {reviewTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tasks waiting for review</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewTasks.map(task => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <TaskCard task={task} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeFilter === 'completed' && (
          <>
            {completedTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No completed tasks in the last 7 days</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <TaskCard task={task} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
