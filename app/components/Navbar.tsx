'use client';

import { Bell, ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import GlobalSearch from './GlobalSearch';
import RoleSwitcher from './RoleSwitcher';
import { useAuth } from '@/app/context/AuthContext';
import { useTaskComposer } from '@/app/context/TaskComposerContext';
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const { currentUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { openComposer } = useTaskComposer();
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName = user?.fullName || user?.firstName || currentUser.name;
  const displayEmail = user?.primaryEmailAddress?.emailAddress || currentUser.email;
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/sign-in' });
  };

  return (
    <header className="fixed right-0 top-0 left-60 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-8">
        {/* Global Search */}
        <GlobalSearch />

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <SignedIn>
            {/* Quick Add Button */}
            <button
              onClick={openComposer}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </button>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Role Switcher - For Testing */}
            <div className="border-l border-gray-200 pl-4">
              <RoleSwitcher />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-gray-700">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{displayEmail}</p>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Settings
                      </a>
                    </li>
                    <li>
                      <a href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Help
                      </a>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button
                  type="button"
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                >
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
