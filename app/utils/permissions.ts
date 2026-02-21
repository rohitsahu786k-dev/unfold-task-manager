// Permission and auth utilities
import { User, UserRole, Permission } from '@/app/types';
import { ROLES, MOCK_USERS } from '@/app/types/mockData';

export const getRole = (role: UserRole) => {
  return ROLES.find((r) => r.name === role);
};

export const hasPermission = (user: User, permissionName: string): boolean => {
  const role = getRole(user.role);
  if (!role) return false;
  return role.permissions.some((p) => p.name === permissionName);
};

export const hasPermissions = (user: User, permissionNames: string[]): boolean => {
  return permissionNames.every((perm) => hasPermission(user, perm));
};

export const canViewProject = (user: User, projectAgencyId: string): boolean => {
  if (hasPermission(user, 'view_all_data')) return true;
  if (user.role === 'agency_user' && user.agency_id === projectAgencyId) return true;
  return false;
};

export const canViewTask = (user: User, taskAssignedTo: string): boolean => {
  if (hasPermission(user, 'view_all_data')) return true;
  if (hasPermission(user, 'manage_tasks')) return true;
  if (user.id === taskAssignedTo) return true;
  return false;
};

export const canApproveTask = (user: User): boolean => {
  return hasPermission(user, 'approve_tasks');
};

export const canSubmitTasks = (user: User): boolean => {
  return user.role === 'developer';
};

export const canManageTasks = (user: User): boolean => {
  return hasPermission(user, 'manage_tasks');
};

export const canSubmitProject = (user: User): boolean => {
  return user.role === 'agency_user';
};

export const getTaskVisibilityRules = (user: User) => {
  if (user.role === 'developer') {
    return {
      canViewAllTasks: false,
      canViewCompletedTasksForDays: 7,
      viewMode: 'assigned_only' as const,
    };
  }
  return {
    canViewAllTasks: true,
    canViewCompletedTasksForDays: null,
    viewMode: 'all' as const,
  };
};

export const getProjectVisibilityFilter = (user: User) => {
  if (user.role === 'agency_user') {
    return {
      filterBy: 'agency',
      agencyId: user.agency_id,
    };
  }
  if (user.role === 'developer') {
    return {
      filterBy: 'assigned_tasks',
      userId: user.id,
    };
  }
  return {
    filterBy: 'none',
  };
};

export const getRoleDisplayName = (role: UserRole): string => {
  return ROLES.find((r) => r.name === role)?.displayName || role;
};

export const getUserById = (userId: string): User | undefined => {
  return MOCK_USERS.find((u) => u.id === userId);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return MOCK_USERS.filter((u) => u.role === role);
};

export const getAllDevelopers = (): User[] => {
  return MOCK_USERS.filter((u) => u.role === 'developer');
};

export const getAllManagers = (): User[] => {
  return MOCK_USERS.filter((u) => u.role === 'manager' || u.role === 'admin' || u.role === 'super_admin');
};

export const canAccessTechnicalVault = (user: User): boolean => {
  return hasPermission(user, 'view_technical_vault');
};

export const getDashboardWidgets = (user: User) => {
  const widgets = [];

  if (user.role === 'super_admin' || user.role === 'admin') {
    widgets.push('new_projects', 'project_status', 'overdue_tasks', 'task_review_queue', 'team_activity');
  }

  if (user.role === 'manager') {
    widgets.push('team_workload', 'project_status', 'tasks_pending_review', 'upcoming_deadlines', 'team_activity');
  }

  if (user.role === 'developer') {
    widgets.push('my_tasks', 'tasks_for_review', 'upcoming_deadlines', 'recent_activity');
  }

  if (user.role === 'agency_user') {
    widgets.push('my_projects', 'project_status', 'recent_submissions', 'support_contact');
  }

  return widgets;
};
