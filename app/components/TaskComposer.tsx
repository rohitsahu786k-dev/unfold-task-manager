'use client';

import { useCallback, useRef, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { notifyTaskCreated } from '@/lib/slack-integration';
import { useAuth } from '@/app/context/AuthContext';
import PromptCard from './TaskComposer/PromptCard';
import AttachmentUploader from './TaskComposer/AttachmentUploader';
import TimelineBlock from './TaskComposer/TimelineBlock';
import AssignmentBlock from './TaskComposer/AssignmentBlock';
import AdvancedOptionsAccordion from './TaskComposer/AdvancedOptionsAccordion';
import ProjectContextSidebar from './TaskComposer/ProjectContextSidebar';
import StickyActionBar from './TaskComposer/StickyActionBar';

type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Stage = 'not_started' | 'in_progress' | 'blocked' | 'sent_for_review';

interface TaskComposerData {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  project_id: string | null;
  assigned_to: string | null;
  start_date: string | null;
  deadline: string | null;
  status: Stage;
  review_required: boolean;
  notify_in_app: boolean;
  is_protected: boolean;
  estimated_hours: string | null;
  attachments: string[];
  created_by: string;
  created_at: string;
}

interface TaskComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (taskData: TaskComposerData) => void;
}

const INITIAL_STAGE: Stage = 'not_started';

export default function TaskComposer({ isOpen, onClose, onSubmit }: TaskComposerProps) {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [project, setProject] = useState('');
  const [assignee, setAssignee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [stage, setStage] = useState<Stage>(INITIAL_STAGE);
  const [estimatedHours, setEstimatedHours] = useState('');
  const [reviewRequired, setReviewRequired] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const formatText = (tag: 'bold' | 'italic' | 'list' | 'link') => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = description.substring(selectionStart, selectionEnd);
    const before = description.substring(0, selectionStart);
    const after = description.substring(selectionEnd);

    let formatted = description;
    switch (tag) {
      case 'bold':
        formatted = `${before}**${selectedText || 'text'}**${after}`;
        break;
      case 'italic':
        formatted = `${before}_${selectedText || 'text'}_${after}`;
        break;
      case 'list':
        formatted = `${before}\n- ${selectedText || 'item'}${after}`;
        break;
      case 'link':
        formatted = `${before}[${selectedText || 'link text'}](url)${after}`;
        break;
      default:
        break;
    }

    setDescription(formatted);
    requestAnimationFrame(() => {
      textarea.focus();
    });
  };

  const handleAddFiles = useCallback((files: File[]) => {
    if (!files.length) return;
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetForm = () => {
    setDescription('');
    setTaskTitle('');
    setPriority('medium');
    setProject('');
    setAssignee('');
    setStartDate('');
    setDueDate('');
    setStage(INITIAL_STAGE);
    setEstimatedHours('');
    setReviewRequired(false);
    setNotifyInApp(true);
    setIsProtected(false);
    setAttachments([]);
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    if (!taskTitle.trim() || !description.trim()) {
      alert('Please provide a task title and description before creating a task.');
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData: TaskComposerData = {
        id: `task_${Date.now()}`,
        title: taskTitle.trim(),
        description: description.trim(),
        priority,
        project_id: project || null,
        assigned_to: assignee || null,
        start_date: startDate || null,
        deadline: dueDate || null,
        status: stage,
        review_required: reviewRequired,
        notify_in_app: notifyInApp,
        is_protected: isProtected,
        estimated_hours: estimatedHours || null,
        attachments: attachments.map((file) => file.name),
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
      };

      if (onSubmit) {
        onSubmit(taskData);
      }

      await notifyTaskCreated({
        taskId: taskData.id,
        taskTitle: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignee: assignee || 'Unassigned',
        creator: currentUser.name,
        deadline: dueDate || 'Not set',
      });

      setSuccessMessage('Task created successfully!');

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FAFB]"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-5 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Task Composer</p>
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="mt-1 text-sm text-gray-600">
            Describe what needs to be done. Add structured details below.
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="rounded-full border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
          aria-label="Close composer"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 xl:flex-row">
          <div className="mx-auto w-full max-w-[900px] flex-1 space-y-6">
            {successMessage && (
              <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 shadow-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <label className="text-sm font-semibold text-gray-900">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What's the main objective?"
                className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <PromptCard
              textareaRef={descriptionRef}
              value={description}
              onChange={setDescription}
              onFormat={formatText}
              onFilesDropped={handleAddFiles}
            />

            <TimelineBlock
              startDate={startDate}
              onStartDateChange={setStartDate}
              dueDate={dueDate}
              onDueDateChange={setDueDate}
              priority={priority}
              onPriorityChange={setPriority}
              stage={stage}
              onStageChange={setStage}
            />

            <AssignmentBlock
              assignee={assignee}
              onAssigneeChange={setAssignee}
              project={project}
              onProjectChange={setProject}
            />

            <AttachmentUploader
              files={attachments}
              onAddFiles={handleAddFiles}
              onRemoveFile={removeAttachment}
            />

            <AdvancedOptionsAccordion
              estimatedHours={estimatedHours}
              onEstimatedHoursChange={setEstimatedHours}
              reviewRequired={reviewRequired}
              onReviewRequiredChange={setReviewRequired}
              notifyInApp={notifyInApp}
              onNotifyInAppChange={setNotifyInApp}
              isProtected={isProtected}
              onProtectedChange={setIsProtected}
            />
          </div>

          <div className="hidden xl:block">
            <ProjectContextSidebar projectId={project} />
          </div>
        </div>
      </div>

      <StickyActionBar
        onCancel={handleCancel}
        onSave={handleSubmit}
        isSaving={isSubmitting}
        disableSave={!taskTitle.trim() || !description.trim()}
      />
    </div>
  );
}
