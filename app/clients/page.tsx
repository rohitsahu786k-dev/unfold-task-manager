'use client';

import DashboardLayout from '../components/DashboardLayout';

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="mt-2 text-gray-600">Manage your clients and their projects.</p>
      </div>
    </DashboardLayout>
  );
}
