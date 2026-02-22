'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, AlertCircle, Eye, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type FilterType = 'active' | 'review' | 'completed';

interface TaskProject {
  id: string;
  name: string;
}

interface DbTask {
  id: string;
  title: string;
  description: string | null;
  projectId: string | null;
  assignedTo: string | null;
  createdBy: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  acceptanceCriteria: string | null;
  createdAt: string;
  updatedAt: string;
  project?: TaskProject | null;
}

const ACTIVE_STATUSES = new Set(['not_started', 'in_progress', 'blocked', 'waiting']);
const REVIEW_STATUSES = new Set(['pending_review', 'sent_for_review', 'changes_requested']);
const COMPLETED_STATUSES = new Set(['completed', 'approved']);

export default function TasksPage() {
  const { currentUser } = useAuth();
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks', {
          cache: 'no-store',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = (await response.json()) as DbTask[];
        if (isMounted) {
          setTasks(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load tasks');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  const viewerEmail = (
    user?.primaryEmailAddress?.emailAddress ||
    currentUser.email ||
    ''
  ).toLowerCase();

  const allTasks = useMemo(() => {
    if (currentUser.role !== 'developer') {
      return tasks;
    }

    const assignedToCurrentUser = tasks.filter(
      (task) => (task.assignedTo || '').toLowerCase() === viewerEmail
    );

    // Fallback for local testing when Clerk email does not exist in seeded DB users.
    return assignedToCurrentUser.length > 0 ? assignedToCurrentUser : tasks;
  }, [currentUser.role, tasks, viewerEmail]);

  const activeTasks = allTasks.filter((task) => ACTIVE_STATUSES.has(task.status));
  const reviewTasks = allTasks.filter((task) => REVIEW_STATUSES.has(task.status));
  const completedTasks = allTasks
    .filter((task) => COMPLETED_STATUSES.has(task.status))
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 20);

  const filterTabs = [
    { id: 'active', label: 'Active', count: activeTasks.length, icon: <Clock className="h-4 w-4" /> },
    { id: 'review', label: 'Sent for Review', count: reviewTasks.length, icon: <Eye className="h-4 w-4" /> },
    { id: 'completed', label: 'Completed', count: completedTasks.length, icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const getTaskProject = (task: DbTask) => task.project?.name || 'Unassigned project';

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const TaskCard = ({ task }: { task: DbTask }) => {
    const projectName = getTaskProject(task);
    const overdue = isOverdue(task.deadline);

    return (
      <div
        className={`rounded-lg border p-4 transition-all hover:shadow-md ${
          overdue && !COMPLETED_STATUSES.has(task.status) ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <p className="mt-1 text-sm text-gray-600">Project: {projectName}</p>
          </div>
          <div className="ml-4 flex items-center gap-2">
            {REVIEW_STATUSES.has(task.status) && (
              <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                Review Required
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                task.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-700'
                  : REVIEW_STATUSES.has(task.status)
                    ? 'bg-yellow-100 text-yellow-700'
                    : COMPLETED_STATUSES.has(task.status)
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'blocked'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
              }`}
            >
              {task.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{task.description || 'No description'}</p>

        <div className="mb-3 flex items-center justify-between border-t border-gray-200 pb-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</span>
            {task.estimatedHours ? <span>{task.estimatedHours}h estimated</span> : null}
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              task.priority === 'urgent'
                ? 'bg-red-100 text-red-700'
                : task.priority === 'high'
                  ? 'bg-orange-100 text-orange-700'
                  : task.priority === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
            }`}
          >
            {task.priority}
          </span>
        </div>

        {!COMPLETED_STATUSES.has(task.status) ? (
          <div className="flex gap-2">
            {REVIEW_STATUSES.has(task.status) ? (
              <div className="flex-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
                Awaiting approval from manager
              </div>
            ) : (
              <>
                <button className="flex-1 rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                  View
                </button>
                <button className="flex-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Update
                </button>
                {task.status !== 'blocked' ? (
                  <button className="flex-1 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700">
                    Submit for Review
                  </button>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Completed on {new Date(task.updatedAt).toLocaleDateString()}
          </div>
        )}

        {overdue && !COMPLETED_STATUSES.has(task.status) ? (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>This task is overdue! Please prioritize.</span>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="mt-2 text-gray-600">
          {currentUser.role === 'developer' ? 'View and manage your assigned tasks' : 'View all task activity'}
        </p>
        <p className="mt-1 text-sm text-gray-500">Loaded from database: {tasks.length} task(s)</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-8">
        <div className="flex gap-2 border-b border-gray-200">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterType)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeFilter === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activeFilter === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-600">Loading tasks from database...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeFilter === 'active' ? (
            activeTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
                <p className="text-gray-600">All tasks completed! Great work!</p>
              </div>
            ) : (
              <>
                {activeTasks.some((task) => isOverdue(task.deadline)) ? (
                  <>
                    <h3 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold uppercase text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      Overdue
                    </h3>
                    <div className="mb-6 space-y-3">
                      {activeTasks
                        .filter((task) => isOverdue(task.deadline))
                        .map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                  </>
                ) : null}

                <h3 className="mb-2 px-1 text-sm font-semibold uppercase text-gray-900">Upcoming</h3>
                <div className="space-y-3">
                  {activeTasks
                    .filter((task) => !isOverdue(task.deadline))
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </>
            )
          ) : null}

          {activeFilter === 'review' ? (
            reviewTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <Eye className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">No tasks waiting for review</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )
          ) : null}

          {activeFilter === 'completed' ? (
            completedTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">No completed tasks yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )
          ) : null}
        </div>
      )}
    </DashboardLayout>
  );
}
