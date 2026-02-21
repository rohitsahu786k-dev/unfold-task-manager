'use client';

import { ReactNode } from 'react';
import TaskComposer from './components/TaskComposer';
import { AuthProvider } from './context/AuthContext';
import { TaskComposerProvider, useTaskComposer } from './context/TaskComposerContext';

function TaskComposerPortal() {
  const { isOpen, closeComposer } = useTaskComposer();

  return <TaskComposer isOpen={isOpen} onClose={closeComposer} />;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TaskComposerProvider>
        {children}
        <TaskComposerPortal />
      </TaskComposerProvider>
    </AuthProvider>
  );
}
