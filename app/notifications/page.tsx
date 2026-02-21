'use client';

import DashboardLayout from '../components/DashboardLayout';

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-2 text-gray-600">View and manage your notifications.</p>
      </div>
    </DashboardLayout>
  );
}
