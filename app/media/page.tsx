'use client';

import DashboardLayout from '../components/DashboardLayout';

export default function MediaPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-2 text-gray-600">Browse and manage your media files.</p>
      </div>
    </DashboardLayout>
  );
}
