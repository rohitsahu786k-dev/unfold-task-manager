'use client';

interface AssignmentBlockProps {
  assignee: string;
  onAssigneeChange: (value: string) => void;
  project: string;
  onProjectChange: (value: string) => void;
}

const mockAssignees = [
  { id: '1', name: 'John Doe', role: 'Project Manager' },
  { id: '2', name: 'Jane Smith', role: 'Developer' },
  { id: '3', name: 'Bob Johnson', role: 'Designer' },
  { id: '4', name: 'Alice Williams', role: 'Analyst' },
];

const mockProjects = [
  { id: 'p1', name: 'Website Redesign', client: 'Acme Corp' },
  { id: 'p2', name: 'Mobile App Development', client: 'Tech Startup' },
  { id: 'p3', name: 'Database Migration', client: 'Enterprise Inc' },
];

export default function AssignmentBlock({
  assignee,
  onAssigneeChange,
  project,
  onProjectChange,
}: AssignmentBlockProps) {
  const selectedAssignee = mockAssignees.find(a => a.id === assignee);
  const selectedProject = mockProjects.find(p => p.id === project);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Assignment</h3>

      <div className="space-y-4">
        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignee
          </label>
          <select
            value={assignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select assignee...</option>
            {mockAssignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} - {a.role}
              </option>
            ))}
          </select>
          {selectedAssignee && (
            <div className="mt-2 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
                {selectedAssignee.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedAssignee.name}</p>
                <p className="text-xs text-gray-500">{selectedAssignee.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project <span className="text-red-500">*</span>
          </label>
          <select
            value={project}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select project...</option>
            {mockProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {selectedProject && (
            <div className="mt-2 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">{selectedProject.name}</p>
              <p className="text-xs text-gray-500">{selectedProject.client}</p>
            </div>
          )}
        </div>

        {/* Milestone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Milestone (optional)
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            disabled={!project}
          >
            <option value="">Select milestone...</option>
            <option value="m1">Phase 1 - Design</option>
            <option value="m2">Phase 2 - Development</option>
            <option value="m3">Phase 3 - Testing</option>
          </select>
        </div>
      </div>
    </div>
  );
}
