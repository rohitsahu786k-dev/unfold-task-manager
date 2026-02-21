'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '@/app/context/AuthContext';
import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Lock, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { User, UserRole } from '@/app/types/index';
import { MOCK_USERS, MOCK_ACTIVITY_LOGS } from '@/app/types/mockData';
import CreateUserModal from '../components/UserManagement/CreateUserModal';
import EditUserModal from '../components/UserManagement/EditUserModal';
import ResetPasswordModal from '../components/UserManagement/ResetPasswordModal';
import ActivityLogModal from '../components/UserManagement/ActivityLogModal';

type ModalType = 'create' | 'edit' | 'resetPassword' | 'activityLog' | null;

export default function UserManagementPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user has permission to manage users (admin or super_admin)
  const canManageUsers = currentUser.role === 'super_admin' || currentUser.role === 'admin';

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleCreateUser = (formData: any) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      timezone: formData.timezone,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    setActiveModal(null);
    showSuccess(`User "${formData.name}" created successfully!`);
  };

  const handleEditUser = (formData: any) => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            timezone: formData.timezone,
            updated_at: new Date().toISOString().split('T')[0],
          }
        : user
    );
    setUsers(updatedUsers);
    setActiveModal(null);
    setSelectedUser(null);
    showSuccess(`User "${formData.name}" updated successfully!`);
  };

  const handleResetPassword = (password: string) => {
    if (!selectedUser) return;
    setActiveModal(null);
    setSelectedUser(null);
    showSuccess(`Password reset for "${selectedUser.name}". New temporary password sent to email.`);
  };

  const handleToggleStatus = (user: User) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, status: (u.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
        : u
    );
    setUsers(updatedUsers);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    showSuccess(`User "${user.name}" has been ${newStatus}.`);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) {
      setUsers(users.filter((u) => u.id !== user.id));
      showSuccess(`User "${user.name}" has been deleted.`);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setActiveModal('edit');
  };

  const handleOpenResetPasswordModal = (user: User) => {
    setSelectedUser(user);
    setActiveModal('resetPassword');
  };

  const handleOpenActivityLog = (user: User) => {
    setSelectedUser(user);
    setActiveModal('activityLog');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!canManageUsers) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-800">Only administrators can access User Management.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">Create, edit, and manage user accounts and permissions.</p>
          </div>
          <button
            onClick={() => setActiveModal('create')}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create User
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="developer">Developer</option>
              <option value="agency_user">Agency User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === 'active').length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Inactive Users</p>
            <p className="text-2xl font-bold text-gray-600">{users.filter((u) => u.status === 'inactive').length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-600">Created</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.created_at}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenResetPasswordModal(user)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenActivityLog(user)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Activity Log"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'create' && (
        <CreateUserModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateUser}
        />
      )}

      {activeModal === 'edit' && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setActiveModal(null);
            setSelectedUser(null);
          }}
          onSubmit={handleEditUser}
        />
      )}

      {activeModal === 'resetPassword' && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={() => {
            setActiveModal(null);
            setSelectedUser(null);
          }}
          onSubmit={handleResetPassword}
        />
      )}

      {activeModal === 'activityLog' && selectedUser && (
        <ActivityLogModal
          user={selectedUser}
          onClose={() => {
            setActiveModal(null);
            setSelectedUser(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}
