'use client';

type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Stage = 'not_started' | 'in_progress' | 'blocked' | 'sent_for_review';

interface TimelineBlockProps {
  startDate: string;
  onStartDateChange: (value: string) => void;
  dueDate: string;
  onDueDateChange: (value: string) => void;
  priority: Priority;
  onPriorityChange: (value: Priority) => void;
  stage: Stage;
  onStageChange: (value: Stage) => void;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

const stageOptions: { value: Stage; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'sent_for_review', label: 'Sent for Review' },
];

export default function TimelineBlock({
  startDate,
  onStartDateChange,
  dueDate,
  onDueDateChange,
  priority,
  onPriorityChange,
  stage,
  onStageChange,
}: TimelineBlockProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Timeline & Priority</h3>

      <div className="space-y-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Priority
          </label>
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPriorityChange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  priority === option.value
                    ? `${option.color} ring-2 ring-offset-2 ring-gray-400`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Stage
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStageChange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  stage === option.value
                    ? 'bg-green-500 text-white ring-2 ring-offset-2 ring-green-300'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
