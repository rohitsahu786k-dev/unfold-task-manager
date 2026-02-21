'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import { Bell, Lock, Eye, Globe, Sliders, Check } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  projectUpdates: boolean;
  weeklyDigest: boolean;
  commentMentions: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'team';
  showOnlineStatus: boolean;
  allowMessaging: boolean;
  shareActivity: boolean;
}

interface GeneralSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'auto';
}

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'general'>('notifications');

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    taskAssigned: true,
    taskCompleted: true,
    projectUpdates: true,
    weeklyDigest: false,
    commentMentions: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'team',
    showOnlineStatus: true,
    allowMessaging: true,
    shareActivity: true,
  });

  const [general, setGeneral] = useState<GeneralSettings>({
    language: 'English',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    showSuccess();
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy({ ...privacy, [key]: value });
    showSuccess();
  };

  const handleGeneralChange = (key: keyof GeneralSettings, value: string) => {
    setGeneral({ ...general, [key]: value });
    showSuccess();
  };

  const showSuccess = () => {
    setSuccessMessage('Settings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account, notifications, and preferences.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-0 overflow-hidden sticky top-20">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left font-medium transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left font-medium transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  Privacy
                </button>
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left font-medium transition-colors ${
                    activeTab === 'general'
                      ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Sliders className="h-5 w-5" />
                  General
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
                </div>

                {/* Email & Push Master Toggles */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive important updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                {/* Specific Notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Notification Preferences</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Task Assigned</p>
                      <p className="text-sm text-gray-600">When a task is assigned to me</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.taskAssigned}
                        onChange={() => handleNotificationChange('taskAssigned')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Task Completed</p>
                      <p className="text-sm text-gray-600">When a task I assigned is completed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.taskCompleted}
                        onChange={() => handleNotificationChange('taskCompleted')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Project Updates</p>
                      <p className="text-sm text-gray-600">Notifications for project changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.projectUpdates}
                        onChange={() => handleNotificationChange('projectUpdates')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Comment Mentions</p>
                      <p className="text-sm text-gray-600">When someone mentions me in comments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.commentMentions}
                        onChange={() => handleNotificationChange('commentMentions')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600">Summary of weekly activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.weeklyDigest}
                        onChange={() => handleNotificationChange('weeklyDigest')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Privacy Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option value="public">Public - Everyone can see your profile</option>
                      <option value="team">Team Only - Only team members can see your profile</option>
                      <option value="private">Private - Only you can see your profile</option>
                    </select>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Show Online Status</p>
                        <p className="text-sm text-gray-600">Let others see when you're online</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showOnlineStatus}
                          onChange={() => handlePrivacyChange('showOnlineStatus', !privacy.showOnlineStatus)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Allow Direct Messaging</p>
                        <p className="text-sm text-gray-600">Let others send you direct messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.allowMessaging}
                          onChange={() => handlePrivacyChange('allowMessaging', !privacy.allowMessaging)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Share Activity Status</p>
                        <p className="text-sm text-gray-600">Show your activity in projects and tasks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.shareActivity}
                          onChange={() => handlePrivacyChange('shareActivity', !privacy.shareActivity)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Sliders className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">General Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={general.language}
                      onChange={(e) => handleGeneralChange('language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={general.timezone}
                      onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option>America/New_York</option>
                      <option>America/Chicago</option>
                      <option>America/Denver</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                      <option>Europe/Paris</option>
                      <option>Asia/Tokyo</option>
                      <option>Asia/Shanghai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={general.dateFormat}
                      onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={general.theme}
                      onChange={(e) => handleGeneralChange('theme', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
