'use client';

import DashboardLayout from '../components/DashboardLayout';

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="mt-2 text-gray-600">View and manage your contacts.</p>
      </div>
    </DashboardLayout>
  );
}
