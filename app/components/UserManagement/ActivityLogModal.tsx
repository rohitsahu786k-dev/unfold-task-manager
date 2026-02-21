'use client';

import { X } from 'lucide-react';
import { User } from '@/app/types/index';
import { MOCK_ACTIVITY_LOGS } from '@/app/types/mockData';

interface ActivityLogModalProps {
  user: User;
  onClose: () => void;
}

export default function ActivityLogModal({ user, onClose }: ActivityLogModalProps) {
  const userActivities = MOCK_ACTIVITY_LOGS.filter((log) => log.user_id === user.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            Activity log for: <span className="font-semibold text-gray-900">{user.name}</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">Email: {user.email}</p>
        </div>

        {userActivities.length > 0 ? (
          <div className="space-y-4">
            {userActivities.map((activity) => (
              <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                        {activity.action}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {activity.resource_type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>{activity.timestamp}</span>
                      {activity.ip_address && <span>IP: {activity.ip_address}</span>}
                      {activity.resource_id && <span>Resource ID: {activity.resource_id}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No activity logs found for this user.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
