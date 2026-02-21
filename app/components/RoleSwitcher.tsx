'use client';

import { useAuth } from '@/app/context/AuthContext';
import { getRoleDisplayName } from '@/app/utils/permissions';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function RoleSwitcher() {
  const { currentUser, switchUser, allUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 text-sm font-medium transition-colors"
        title="Switch user role for testing"
      >
        <span className="text-xs uppercase font-semibold">Test:</span>
        {currentUser.name}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {allUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                switchUser(user.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                currentUser.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
                </div>
                {user.id === currentUser.id && (
                  <span className="text-blue-500 font-bold">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
