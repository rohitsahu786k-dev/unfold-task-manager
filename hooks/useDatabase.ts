'use client';

import { useState, useEffect } from 'react';
import { User, Project, Task, UserActivity } from '@/app/types/index';

interface UseDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useUsers() {
  const [state, setState] = useState<UseDataState<User>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchData();
  }, []);

  return state;
}

export function useProjects() {
  const [state, setState] = useState<UseDataState<Project>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchData();
  }, []);

  return state;
}

export function useTasks() {
  const [state, setState] = useState<UseDataState<Task>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchData();
  }, []);

  return state;
}

export function useActivityLogs() {
  const [state, setState] = useState<UseDataState<UserActivity>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/activity-logs');
        if (!response.ok) throw new Error('Failed to fetch activity logs');
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchData();
  }, []);

  return state;
}
