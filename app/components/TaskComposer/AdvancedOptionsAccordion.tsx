'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AdvancedOptionsAccordionProps {
  estimatedHours: string;
  onEstimatedHoursChange: (value: string) => void;
  reviewRequired: boolean;
  onReviewRequiredChange: (value: boolean) => void;
  notifyInApp: boolean;
  onNotifyInAppChange: (value: boolean) => void;
  isProtected: boolean;
  onProtectedChange: (value: boolean) => void;
}

export default function AdvancedOptionsAccordion({
  estimatedHours,
  onEstimatedHoursChange,
  reviewRequired,
  onReviewRequiredChange,
  notifyInApp,
  onNotifyInAppChange,
  isProtected,
  onProtectedChange,
}: AdvancedOptionsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-md">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-900">Advanced Options</h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-t border-gray-200 px-6 py-4 space-y-4">
          {/* Estimated Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Hours
            </label>
            <input
              type="number"
              value={estimatedHours}
              onChange={(e) => onEstimatedHoursChange(e.target.value)}
              placeholder="e.g., 8"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Review Required Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Review Required
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Flag this task for review before completion
              </p>
            </div>
            <input
              type="checkbox"
              checked={reviewRequired}
              onChange={(e) => onReviewRequiredChange(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
            />
          </div>

          {/* Notify In-App Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notify via in-app
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Send assignee in-app notifications
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyInApp}
              onChange={(e) => onNotifyInAppChange(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
            />
          </div>

          {/* Protected Task Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Protected Task
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Restrict access to admin users only
              </p>
            </div>
            <input
              type="checkbox"
              checked={isProtected}
              onChange={(e) => onProtectedChange(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
            />
          </div>

          {/* SLA Indicator */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm font-medium text-blue-900">SLA Indicator</p>
            <p className="text-xs text-blue-700 mt-1">
              Standard SLA: 5 business days for review
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
