'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TaskComposerContextType {
  isOpen: boolean;
  openComposer: () => void;
  closeComposer: () => void;
}

const TaskComposerContext = createContext<TaskComposerContextType | undefined>(undefined);

export function TaskComposerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openComposer = () => setIsOpen(true);
  const closeComposer = () => setIsOpen(false);

  return (
    <TaskComposerContext.Provider value={{ isOpen, openComposer, closeComposer }}>
      {children}
    </TaskComposerContext.Provider>
  );
}

export function useTaskComposer() {
  const context = useContext(TaskComposerContext);
  if (context === undefined) {
    throw new Error('useTaskComposer must be used within a TaskComposerProvider');
  }
  return context;
}
