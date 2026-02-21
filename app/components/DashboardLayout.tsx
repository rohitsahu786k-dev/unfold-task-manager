'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="mt-16 ml-60 p-8 bg-white min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
