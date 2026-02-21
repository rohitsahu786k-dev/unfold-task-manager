'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROJECTS } from '../types/mockData';
import { Calendar, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { currentUser } = useAuth();

  // Filter projects based on user role
  const getVisibleProjects = () => {
    if (currentUser.role === 'agency_user') {
      return MOCK_PROJECTS.filter(p => p.agency_id === currentUser.agency_id);
    }
    return MOCK_PROJECTS;
  };

  const projects = getVisibleProjects();

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">
              {currentUser.role === 'agency_user' 
                ? 'View and manage your submitted projects' 
                : 'View and manage all projects'}
            </p>
          </div>
          {currentUser.role === 'agency_user' && (
            <Link href="/agency/submit-project">
              <button className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                + New Project
              </button>
            </Link>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{project.name}</h3>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                    project.status === 'pending_intake' ? 'bg-yellow-100 text-yellow-700' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Basic Info */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.requirement_notes}</p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{project.type}</span>
                  </div>
                </div>

                {/* Priority & Progress */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    project.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {project.priority}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Progress</p>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No projects found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
