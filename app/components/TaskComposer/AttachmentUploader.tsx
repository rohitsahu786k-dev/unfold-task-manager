'use client';

import { useRef } from 'react';
import { Lock, Upload, X, FileIcon, FileText, Image as ImageIcon, FileSpreadsheet, FileCode, FileArchive } from 'lucide-react';

interface AttachmentUploaderProps {
  files: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
      return FileText;
    case 'xls':
    case 'xlsx':
      return FileSpreadsheet;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return ImageIcon;
    case 'zip':
    case 'rar':
      return FileArchive;
    case 'js':
    case 'ts':
    case 'tsx':
    case 'json':
      return FileCode;
    default:
      return FileIcon;
  }
};

const formatFileSize = (bytes: number) => {
  if (!bytes) {
    return '0 Bytes';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(1)} ${units[i]}`;
};

export default function AttachmentUploader({ files, onAddFiles, onRemoveFile }: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Attachments</h3>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-gray-400"
      >
        <Upload className="mx-auto h-6 w-6 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">Drag and drop files here</p>
        <p className="text-xs text-gray-500">or click to select files</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            {files.length} file{files.length === 1 ? '' : 's'} attached
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => {
              const Icon = getFileIcon(file.name);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div className="max-w-xs">
                      <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
        <Lock className="h-4 w-4 text-gray-500" />
        Files inherit the task&apos;s protected status. Mark the task as protected to limit file access.
      </div>
    </div>
  );
}
