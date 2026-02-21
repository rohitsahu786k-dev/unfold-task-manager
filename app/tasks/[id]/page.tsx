'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_USERS } from '@/app/types/mockData';
import { ArrowLeft, FileText, Clock, AlertCircle, CheckCircle, MessageSquare, Paperclip, Send } from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { currentUser } = useAuth();
  const [taskStatus, setTaskStatus] = useState<string>('');
  const [comment, setComment] = useState('');
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const task = MOCK_TASKS.find(t => t.id === params.id);
  const project = task ? MOCK_PROJECTS.find(p => p.id === task.project_id) : null;
  const assignedBy = task ? MOCK_USERS.find(u => u.id === task.assigned_by) : null;

  if (!task || !project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Task not found</h1>
          <p className="text-gray-600 mt-2">The task you're looking for doesn't exist.</p>
          <Link href="/tasks" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Back to My Tasks
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  const canEdit = task.assigned_to === currentUser.id && task.status !== 'completed';
  const canSubmitForReview = canEdit && task.status !== 'sent_for_review' && task.status !== 'blocked';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskStatus(e.target.value);
  };

  const handleFileUpload = () => {
    setAttachmentCount(prev => prev + 1);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      setComment('');
    }
  };

  const handleSubmitForReview = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    // This would update the task status to 'sent_for_review'
    console.log('Task submitted for review');
    setShowSubmitModal(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to My Tasks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          <p className="text-gray-600 mt-2">
            Project: <span className="font-semibold text-gray-900">{project.name}</span>
          </p>
        </div>
        <div className="text-right">
          <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Alert */}
          {isOverdue && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">This task is overdue</h3>
                <p className="text-sm text-red-700 mt-1">Due date was {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Description Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
            
            {task.acceptance_criteria && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Acceptance Criteria</h3>
                <ul className="space-y-2">
                  {task.acceptance_criteria.map((criterion, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Status Update Card - Only show if task is not sent for review */}
          {canEdit && task.status !== 'sent_for_review' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Task</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={handleStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Select status --</option>
                    {task.status !== 'in_progress' && <option value="in_progress">In Progress</option>}
                    {task.status !== 'blocked' && <option value="blocked">Blocked</option>}
                    <option value={task.status} selected>{task.status.replace(/_/g, ' ')}</option>
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors" onClick={handleFileUpload}>
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>
                  {attachmentCount > 0 && (
                    <p className="text-sm text-green-700 mt-2">
                      ✓ {attachmentCount} file(s) attached
                    </p>
                  )}
                </div>

                {/* Submit for Review Button */}
                {canSubmitForReview && (
                  <button
                    onClick={handleSubmitForReview}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit for Review
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Awaiting Review Message */}
          {task.status === 'sent_for_review' && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Awaiting Manager Review</h3>
                  <p className="text-sm text-yellow-700 mt-2">
                    Your task has been submitted for review. Your manager will review it and either approve it or request changes.
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    Submitted on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              Activity & Comments
            </h2>

            {/* Comment Input */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment about your progress..."
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={4}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{comment.length}/500</span>
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">Project Manager</p>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-gray-700 text-sm">Please make sure to test on mobile devices before submitting.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">Sarah Chen</p>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-gray-700 text-sm">Task has been assigned to you. Please review the acceptance criteria and reach out if you have any questions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Task Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned By</p>
                <p className="text-sm text-gray-900 mt-1">{assignedBy?.name || 'Unknown'}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deadline</p>
                <p className={`text-sm mt-1 font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</p>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estimated Hours</p>
                <p className="text-sm text-gray-900 mt-1">{task.estimated_hours || 'N/A'} hours</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Task Type</p>
                <p className="text-sm text-gray-900 mt-1 capitalize">{task.type}</p>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="text-sm font-semibold text-gray-900">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Related Files */}
          {attachmentCount > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Attachments</h3>
              <div className="space-y-2">
                {Array.from({ length: attachmentCount }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">attachment_{idx + 1}.pdf</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Task for Review?</h2>
            <p className="text-gray-600 mb-6">
              Once submitted, your manager will review this task. You won't be able to make further changes until they respond.
            </p>

            {/* Checklist */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Before you submit:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  Task is complete
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  Acceptance criteria met
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  All files attached
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
