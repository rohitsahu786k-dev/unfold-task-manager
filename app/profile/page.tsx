'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import { Edit2, Check, X, Upload } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  bio: string;
}

interface PasswordFormData {
  current: string;
  new: string;
  confirm: string;
}

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<ProfileFormData>({
    name: currentUser.name,
    email: currentUser.email,
    phone: '+1 (555) 123-4567',
    department: 'Product Management',
    location: 'San Francisco, CA',
    bio: 'Passionate about building great products and leading teams to success.',
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current: '',
    new: '',
    confirm: '',
  });

  const handleBasicChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveBasic = () => {
    setSuccessMessage('Profile information updated successfully!');
    setIsEditingBasic(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleSavePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    setSuccessMessage('Password updated successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
    setIsEditingPassword(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Profile Basic Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <button
              onClick={() => setIsEditingBasic(!isEditingBasic)}
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <Edit2 className="h-4 w-4" />
              {isEditingBasic ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Avatar Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                {currentUser.name.charAt(0)}
              </div>
              {isEditingBasic && (
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditingBasic}
                  value={formData.name}
                  onChange={(e) => handleBasicChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  disabled={!isEditingBasic}
                  value={formData.email}
                  onChange={(e) => handleBasicChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  disabled={!isEditingBasic}
                  value={formData.phone}
                  onChange={(e) => handleBasicChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  disabled={!isEditingBasic}
                  value={formData.department}
                  onChange={(e) => handleBasicChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                disabled={!isEditingBasic}
                value={formData.location}
                onChange={(e) => handleBasicChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                disabled={!isEditingBasic}
                value={formData.bio}
                onChange={(e) => handleBasicChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditingBasic && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveBasic}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingBasic(false)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <button
              onClick={() => setIsEditingPassword(!isEditingPassword)}
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <Edit2 className="h-4 w-4" />
              {isEditingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {!isEditingPassword && (
            <div className="text-gray-600">
              <p className="text-sm">Last password change: 3 months ago</p>
            </div>
          )}

          {isEditingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSavePassword}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Update Password
                </button>
                <button
                  onClick={() => setIsEditingPassword(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Role</span>
              <span className="font-medium text-gray-900">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium text-gray-900">January 15, 2024</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Last Login</span>
              <span className="font-medium text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
