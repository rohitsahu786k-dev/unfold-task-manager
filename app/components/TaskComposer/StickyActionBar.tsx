'use client';

interface StickyActionBarProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  disableSave?: boolean;
}

export default function StickyActionBar({ onCancel, onSave, isSaving, disableSave }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
      <button
        onClick={onCancel}
        className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Cancel
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Save as Draft
        </button>
        <button
          onClick={onSave}
          disabled={isSaving || disableSave}
          className="px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </div>
  );
}
