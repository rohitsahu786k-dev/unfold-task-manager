'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_CONTACTS } from '@/app/types/mockData';
import { Search, Folder, CheckSquare, Users, X } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'project' | 'task' | 'contact';
  url?: string;
  metadata?: string;
}

export default function GlobalSearch() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Permission-aware search
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search Projects
    const visibleProjects = currentUser.role === 'agency_user'
      ? MOCK_PROJECTS.filter(p => p.agency_id === currentUser.agency_id)
      : MOCK_PROJECTS;

    visibleProjects.forEach(project => {
      if (
        project.name.toLowerCase().includes(lowerQuery) ||
        (project.requirement_notes && project.requirement_notes.toLowerCase().includes(lowerQuery))
      ) {
        foundResults.push({
          id: project.id,
          title: project.name,
          description: project.requirement_notes,
          type: 'project',
          url: `/projects/${project.id}`,
          metadata: project.type,
        });
      }
    });

    // Search Tasks
    const visibleTasks = currentUser.role === 'developer'
      ? MOCK_TASKS.filter(t => t.assigned_to === currentUser.id)
      : MOCK_TASKS;

    visibleTasks.forEach(task => {
      if (
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
      ) {
        foundResults.push({
          id: task.id,
          title: task.title,
          description: task.description,
          type: 'task',
          url: `/tasks/${task.id}`,
          metadata: task.status,
        });
      }
    });

    // Search Contacts (accessible to non-agency users)
    if (currentUser.role !== 'agency_user') {
      MOCK_CONTACTS.forEach(contact => {
        if (
          contact.name.toLowerCase().includes(lowerQuery) ||
          (contact.email && contact.email.toLowerCase().includes(lowerQuery))
        ) {
          foundResults.push({
            id: contact.id,
            title: contact.name,
            description: contact.email,
            type: 'contact',
            metadata: contact.company,
          });
        }
      });
    }

    // Limit results
    setResults(foundResults.slice(0, 10));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Folder className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'contact':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'hover:bg-blue-50';
      case 'task':
        return 'hover:bg-green-50';
      case 'contact':
        return 'hover:bg-purple-50';
      default:
        return 'hover:bg-gray-50';
    }
  };

  return (
    <div ref={searchBoxRef} className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search projects, tasks, contacts..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-9 pr-9 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          {searchQuery.trim() === '' ? (
            <div className="p-4 text-center text-gray-600 text-sm">
              <p>Start typing to search...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-600 text-sm">
              <p>No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {/* Group results by type */}
              {/* Projects */}
              {results.some(r => r.type === 'project') && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                    Projects
                  </div>
                  {results
                    .filter(r => r.type === 'project')
                    .map(result => (
                      <Link key={result.id} href={result.url || '#'}>
                        <div className={`px-4 py-3 border-b border-gray-100 flex items-start gap-3 cursor-pointer transition-colors ${getResultColor(result.type)}`}>
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{result.title}</p>
                            <p className="text-xs text-gray-600 truncate">{result.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* Tasks */}
              {results.some(r => r.type === 'task') && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                    Tasks
                  </div>
                  {results
                    .filter(r => r.type === 'task')
                    .map(result => (
                      <Link key={result.id} href={result.url || '#'}>
                        <div className={`px-4 py-3 border-b border-gray-100 flex items-start gap-3 cursor-pointer transition-colors ${getResultColor(result.type)}`}>
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{result.title}</p>
                            <p className="text-xs text-gray-600">Status: {result.metadata?.replace(/_/g, ' ')}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* Contacts */}
              {results.some(r => r.type === 'contact') && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                    Contacts
                  </div>
                  {results
                    .filter(r => r.type === 'contact')
                    .map(result => (
                      <div key={result.id} className={`px-4 py-3 border-b border-gray-100 flex items-start gap-3 ${getResultColor(result.type)}`}>
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{result.title}</p>
                          <p className="text-xs text-gray-600 truncate">{result.description}</p>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
