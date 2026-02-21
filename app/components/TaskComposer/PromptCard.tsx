'use client';

import { Bold, Italic, Link, List, Sparkles, Upload } from 'lucide-react';
import { useState } from 'react';

type FormatCommand = 'bold' | 'italic' | 'list' | 'link';

interface PromptCardProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onFormat: (command: FormatCommand) => void;
  onFilesDropped?: (files: File[]) => void;
}

export default function PromptCard({
  value,
  onChange,
  textareaRef,
  onFormat,
  onFilesDropped,
}: PromptCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onFilesDropped) {
      onFilesDropped(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Prompt</h3>

      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => onFormat('bold')}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormat('italic')}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormat('link')}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
          title="Add Link"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormat('list')}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
            title="Coming soon"
          >
            <Sparkles className="h-4 w-4" />
            AI Assist
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={`Describe the task in detail...\nAdd links, instructions, references, expected output, acceptance criteria...`}
        className="min-h-[160px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-5 text-base text-gray-900 placeholder-gray-500 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-4 rounded-2xl border-2 border-dashed p-5 text-center text-sm transition-colors ${
          isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <Upload className="mx-auto h-5 w-5 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-gray-900">Drag files here</span> or drop references to link context
        </p>
        <p className="text-xs text-gray-500">Supports documents, screenshots, specs, and media</p>
      </div>

      <div className="mt-3 flex justify-end text-xs text-gray-500">
        {value.length} characters
      </div>
    </div>
  );
}
