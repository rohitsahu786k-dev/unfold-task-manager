'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import KPICard from './components/KPICard';
import TaskApprovalModal from './components/TaskApprovalModal';
import {
  Folder,
  CheckSquare,
  Users,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useTaskComposer } from './context/TaskComposerContext';
import { getDashboardWidgets } from './utils/permissions';

interface Project {
  id: string;
  _id?: string;
  name: string;
  status: string;
  agencyId?: string;
  agency_id?: string;
  [key: string]: any;
}

interface Task {
  id: string;
  _id?: string;
  title: string;
  status: string;
  assignedTo?: string;
  assigned_to?: string;
  [key: string]: any;
}

interface User {
  id: string;
  _id?: string;
  email: string;
  role: string;
  [key: string]: any;
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedApprovalTask, setSelectedApprovalTask] = useState<any | null>(null);
  const [approvalStatuses, setApprovalStatuses] = useState<{ [key: string]: string }>({});
  const { openComposer } = useTaskComposer();
  
  // Real data from database
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPendingReview = (status: string) => status === 'sent_for_review' || status === 'pending_review';

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectRes, taskRes, userRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks'),
          fetch('/api/users'),
        ]);

        if (!projectRes.ok || !taskRes.ok || !userRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const projectData = await projectRes.json();
        const taskData = await taskRes.json();
        const userData = await userRes.json();

        setProjects(projectData);
        setTasks(taskData);
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setProjects([]);
        setTasks([]);
        setUsers([]);
        setError('Unable to load live database data right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  
  // Filter data based on user role and permissions
  const getVisibleProjects = () => {
    if (currentUser.role === 'agency_user') {
      return projects.filter(p => (p.agencyId ?? p.agency_id) === currentUser.agency_id);
    }
    return projects;
  };

  const getVisibleTasks = () => {
    if (currentUser.role === 'developer') {
      return tasks.filter(t => (t.assignedTo ?? t.assigned_to) === currentUser.id);
    }
    return tasks;
  };

  const visibleProjects = getVisibleProjects();
  const visibleTasks = getVisibleTasks();

  // Approval handlers
  const handleApprove = (taskId: string, feedback: string) => {
    console.log('Task approved:', taskId, feedback);
    setApprovalStatuses(prev => ({ ...prev, [taskId]: 'approved' }));
    setSelectedApprovalTask(null);
  };

  const handleReject = (taskId: string, feedback: string) => {
    console.log('Task rejected:', taskId, feedback);
    setApprovalStatuses(prev => ({ ...prev, [taskId]: 'rejected' }));
    setSelectedApprovalTask(null);
  };

  const handleRequestChanges = (taskId: string, feedback: string) => {
    console.log('Changes requested:', taskId, feedback);
    setApprovalStatuses(prev => ({ ...prev, [taskId]: 'changes_requested' }));
    setSelectedApprovalTask(null);
  };

  const widgets = getDashboardWidgets(currentUser);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          {currentUser.role === 'super_admin' && "System overview and management"}
          {currentUser.role === 'admin' && "Operational support and monitoring"}
          {currentUser.role === 'manager' && "Team management and project oversight"}
          {currentUser.role === 'developer' && "Your assigned tasks and projects"}
          {currentUser.role === 'agency_user' && "Your submitted projects and status"}
        </p>
      </div>

      {/* Database Connection Warning */}
      {error && (
        <div className="mb-6 p-4 rounded-lg border border-yellow-300 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            📊 <strong>Note:</strong> {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* Role-Specific Widgets */}
      {!loading && (
      <>
      {['super_admin', 'admin'].includes(currentUser.role) && (
        <>
          {/* Admin KPI Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <KPICard
              title="All Projects"
              value={projects.length}
              icon={<Folder className="h-6 w-6 text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <KPICard
              title="Active Tasks"
              value={tasks.filter(t => t.status === 'in_progress').length}
              icon={<CheckSquare className="h-6 w-6 text-green-600" />}
              bgColor="bg-green-100"
            />
            <KPICard
              title="Pending Review"
              value={tasks.filter(t => isPendingReview(t.status)).length}
              icon={<AlertCircle className="h-6 w-6 text-yellow-600" />}
              bgColor="bg-yellow-100"
            />
            <KPICard
              title="Team Members"
              value={users.length}
              icon={<Users className="h-6 w-6 text-purple-600" />}
              bgColor="bg-purple-100"
            />
          </div>

          {/* New Projects Widget */}
          {widgets.includes('new_projects') && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Project Submissions</h3>
              <div className="space-y-3">
                {projects.filter(p => p.status === 'pending_intake').map(proj => (
                  <div key={proj.id} className="flex items-start gap-4 rounded-lg border border-gray-100 bg-blue-50 p-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{proj.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{proj.agencyId ?? proj.agency_id}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {currentUser.role === 'manager' && (
        <>
          {/* Manager KPI Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <KPICard
              title="Team Projects"
              value={visibleProjects.length}
              icon={<Folder className="h-6 w-6 text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <KPICard
              title="Tasks Pending Review"
              value={tasks.filter(t => isPendingReview(t.status)).length}
              icon={<AlertCircle className="h-6 w-6 text-yellow-600" />}
              bgColor="bg-yellow-100"
            />
            <KPICard
              title="Active Team Members"
              value={users.length}
              icon={<Users className="h-6 w-6 text-purple-600" />}
              bgColor="bg-purple-100"
            />
          </div>

          {/* Team Workload */}
          {widgets.includes('team_workload') && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Workload</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Alex Kumar</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">6/8 tasks</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Mike Johnson</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">4/8 tasks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Pending Approval */}
          {widgets.includes('tasks_pending_review') && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Awaiting Approval</h3>
              <div className="space-y-2">
                {tasks.filter(t => isPendingReview(t.status) && approvalStatuses[t.id] === undefined).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        By {users.find(u => (u.id ?? u._id) === (task.assignedTo ?? task.assigned_to))?.email || 'Unknown'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedApprovalTask(task)}
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))}
                {tasks.filter(t => isPendingReview(t.status) && approvalStatuses[t.id] === undefined).length === 0 &&
                 tasks.filter(t => isPendingReview(t.status)).length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    <p>No tasks awaiting approval</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {currentUser.role === 'developer' && (
        <>
          {/* Developer Quick Stats */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            <KPICard
              title="My Tasks"
              value={visibleTasks.length}
              icon={<CheckSquare className="h-6 w-6 text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <KPICard
              title="In Progress"
              value={visibleTasks.filter(t => t.status === 'in_progress').length}
              icon={<Clock className="h-6 w-6 text-yellow-600" />}
              bgColor="bg-yellow-100"
            />
            <KPICard
              title="Completed"
              value={visibleTasks.filter(t => t.status === 'completed').length}
              icon={<CheckSquare className="h-6 w-6 text-green-600" />}
              bgColor="bg-green-100"
            />
          </div>

          {/* My Tasks Widget */}
          {widgets.includes('my_tasks') && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">My Assigned Tasks</h3>
                <button
                  onClick={openComposer}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Add Task
                </button>
              </div>
              <div className="space-y-2">
                {visibleTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      isPendingReview(task.status) ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {currentUser.role === 'agency_user' && (
        <>
          {/* Agency KPI Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
            <KPICard
              title="My Projects"
              value={visibleProjects.length}
              icon={<Folder className="h-6 w-6 text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <KPICard
              title="Pending Review"
              value={visibleProjects.filter(p => p.status === 'pending_intake').length}
              icon={<AlertCircle className="h-6 w-6 text-yellow-600" />}
              bgColor="bg-yellow-100"
            />
          </div>

          {/* My Projects Widget */}
          {widgets.includes('my_projects') && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">My Submitted Projects</h3>
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                  + New Project
                </button>
              </div>
              <div className="space-y-3">
                {visibleProjects.map(proj => (
                  <div key={proj.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{proj.name}</p>
                      <p className="text-sm text-gray-600 mt-1">Deadline: {new Date(proj.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                      proj.status === 'pending_intake' ? 'bg-yellow-100 text-yellow-700' :
                      proj.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      proj.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {proj.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upcoming Deadlines - All Roles */}
      {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'manager') && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {projects.slice(0, 4).map(proj => (
                <div key={proj.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{proj.name}</p>
                      <p className="text-xs text-gray-500">{new Date(proj.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    proj.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    proj.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {proj.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Project Health</span>
                  <span className="text-sm font-bold text-green-600">On Track</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-xs text-gray-500">tasks this week</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* Task Approval Modal */}
      {selectedApprovalTask && (
        <TaskApprovalModal
          task={selectedApprovalTask}
          assignedUser={users.find(u => (u.id ?? u._id) === (selectedApprovalTask.assignedTo ?? selectedApprovalTask.assigned_to)) as any}
          isOpen={true}
          onClose={() => setSelectedApprovalTask(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
        />
      )}

    </DashboardLayout>
  );
}
