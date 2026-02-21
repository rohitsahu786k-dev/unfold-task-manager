// Database service utilities for API calls

export async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function createUser(userData: any) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function fetchProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function createProject(projectData: any) {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function createTask(taskData: any) {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function fetchActivityLogs() {
  try {
    const response = await fetch('/api/activity-logs');
    if (!response.ok) throw new Error('Failed to fetch activity logs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
}

export async function logActivity(activityData: any) {
  try {
    const response = await fetch('/api/activity-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });
    if (!response.ok) throw new Error('Failed to log activity');
    return await response.json();
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
}
