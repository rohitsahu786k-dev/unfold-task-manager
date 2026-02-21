'use client';

import { useState } from 'react';
import { Task, User } from '@/app/types';
import { X, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

interface TaskApprovalModalProps {
  task: Task;
  assignedUser: User | undefined;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (taskId: string, feedback: string) => void;
  onReject: (taskId: string, feedback: string) => void;
  onRequestChanges: (taskId: string, feedback: string) => void;
}

export default function TaskApprovalModal({
  task,
  assignedUser,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}: TaskApprovalModalProps) {
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!action) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (action === 'approve') {
        onApprove(task.id, feedback);
      } else if (action === 'reject') {
        onReject(task.id, feedback);
      } else if (action === 'changes') {
        onRequestChanges(task.id, feedback);
      }

      setFeedback('');
      setAction(null);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Task</h2>
            <p className="text-sm text-gray-600 mt-1">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Submitted By</p>
              <p className="text-gray-900 font-medium mt-1">{assignedUser?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Submitted Date</p>
              <p className="text-gray-900 font-medium mt-1">
                {task.marked_for_review_at ? new Date(task.marked_for_review_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Original Deadline</p>
              <p className="text-gray-900 font-medium mt-1">{new Date(task.deadline).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Priority</p>
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
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Task Description</h3>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {/* Acceptance Criteria */}
          {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Acceptance Criteria</h3>
              <ul className="space-y-2">
                {task.acceptance_criteria.map((criterion, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Textarea */}
          <div className="border-t border-gray-200 pt-6">
            <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                action === 'approve'
                  ? 'Optional: Add any comments for the developer...'
                  : action === 'changes'
                  ? 'Tell the developer what changes are needed...'
                  : 'Explain why this task is being rejected...'
              }
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-2">{feedback.length}/1000 characters</p>
          </div>

          {/* Action Buttons - Selection Phase */}
          {!action && (
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Select Action</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAction('approve')}
                  className="px-4 py-3 border-2 border-green-200 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setAction('changes')}
                  className="px-4 py-3 border-2 border-yellow-200 bg-yellow-50 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
                >
                  ⟳ Changes
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className="px-4 py-3 border-2 border-red-200 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Phase */}
          {action && (
            <div className="border-t border-gray-200 pt-6">
              <div className={`rounded-lg p-4 mb-4 ${
                action === 'approve' ? 'bg-green-50 border border-green-200' :
                action === 'changes' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-semibold ${
                  action === 'approve' ? 'text-green-900' :
                  action === 'changes' ? 'text-yellow-900' :
                  'text-red-900'
                }`}>
                  {action === 'approve' && '✓ You are about to approve this task'}
                  {action === 'changes' && '⟳ You are requesting changes on this task'}
                  {action === 'reject' && '✕ You are about to reject this task'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setAction(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    action === 'changes' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : action === 'approve' ? 'Approve Task' : action === 'changes' ? 'Request Changes' : 'Reject Task'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
