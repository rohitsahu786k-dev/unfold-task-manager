'use client';

import DashboardLayout from '../components/DashboardLayout';

export default function TimesheetsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
        <p className="mt-2 text-gray-600">Track time spent on projects and tasks.</p>
      </div>
    </DashboardLayout>
  );
}
