'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Clock,
  Calendar,
  Users,
  Briefcase,
  ImageIcon,
  Bell,
  Settings,
  Shield,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Platform',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Projects', href: '/projects', icon: Folder },
      { name: 'Tasks', href: '/tasks', icon: CheckSquare },
      { name: 'Timesheets', href: '/timesheets', icon: Clock },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
    ],
  },
  {
    label: 'Resources',
    items: [
      { name: 'Clients', href: '/clients', icon: Briefcase },
      { name: 'Contacts', href: '/contacts', icon: Users },
      { name: 'Media Library', href: '/media', icon: ImageIcon },
    ],
  },
  {
    label: 'Settings',
    items: [
      { name: 'User Management', href: '/users', icon: Shield },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-gray-200 bg-white overflow-y-auto">
      {/* Logo Area */}
      <div className="border-b border-gray-200 px-4 py-5">
        <Link href="/">
          <img 
            src="/assets/unfold-logo.svg" 
            alt="UnfoldCRO" 
            className="w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-6 px-4 py-6">
        {menuItems.map((section) => (
          <div key={section.label}>
            <h3 className="px-2 text-xs font-semibold uppercase text-gray-500">
              {section.label}
            </h3>
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <div
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                          isActive
                            ? 'border-l-4 border-green-500 bg-green-50'
                            : 'border-l-4 border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-gray-600" />
                        <span className="truncate text-sm font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
