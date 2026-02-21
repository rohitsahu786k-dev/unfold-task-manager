'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useState } from 'react';
import { ChevronDown, MessageSquare, BookOpen, AlertCircle, Mail } from 'lucide-react';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I create a new project?',
    answer: 'Go to the Projects section and click the "Add" button in the navbar. Fill in the project details, set the timeline and budget, then click "Create Project". The project will be created and you can start adding tasks immediately.',
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'How do I assign tasks to team members?',
    answer: 'Navigate to the Tasks section, select a task, and click "Edit". From there, you can assign the task to a team member by selecting their name from the assignee dropdown. The team member will receive a notification about the assignment.',
  },
  {
    id: 3,
    category: 'Getting Started',
    question: 'What is the difference between Projects and Tasks?',
    answer: 'Projects are larger bodies of work that contain multiple tasks. Tasks are individual work items that belong to a project. Each task can have subtasks, attachments, and its own timeline.',
  },
  {
    id: 4,
    category: 'Workflows',
    question: 'How does the task approval process work?',
    answer: 'Once a developer completes a task, they submit it for review. Managers or admins can then review the work and either approve it, request changes, or reject it. The status updates throughout this workflow.',
  },
  {
    id: 5,
    category: 'Workflows',
    question: 'Can I set up task dependencies?',
    answer: 'Yes, when editing a task, you can set it as dependent on other tasks. This ensures tasks are completed in the correct order. Tasks with unmet dependencies will show a blocked status.',
  },
  {
    id: 6,
    category: 'Workflows',
    question: 'How do I track project progress?',
    answer: 'The Projects page shows a progress bar for each project based on task completion. Additionally, the Calendar view shows all events and tasks to help you visualize your workload.',
  },
  {
    id: 7,
    category: 'Features',
    question: 'What is Global Search and how do I use it?',
    answer: 'Global Search is the search bar in the navbar. You can search across projects, tasks, contacts, and more. Results are filtered based on your permissions - you\'ll only see items you have access to.',
  },
  {
    id: 8,
    category: 'Features',
    question: 'How do I submit a project as an agency?',
    answer: 'If you have agency user access, go to the Agency section and click "Submit Project". Fill out the 3-step form with project details, budget, and timeline. Once submitted, the admin team will review it.',
  },
  {
    id: 9,
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Go to your Profile page and click the "Change Password" button in the Security section. Enter your current password and new password, then click "Update Password".',
  },
  {
    id: 10,
    category: 'Account',
    question: 'How do I manage my notifications?',
    answer: 'Click the bell icon in the navbar to view your notifications. Go to Settings to configure notification preferences and choose which events trigger notifications.',
  },
];

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));
  const filteredFaqs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="mt-2 text-gray-600">Find answers to common questions and learn how to use UnfoldCRO effectively.</p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Documentation</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Read detailed guides and tutorials for all features</p>
            <button className="text-sm font-medium text-green-600 hover:text-green-700">View Documentation →</button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Community Forum</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Connect with other users and share solutions</p>
            <button className="text-sm font-medium text-green-600 hover:text-green-700">Visit Forum →</button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Contact Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Get help from our support team</p>
            <button className="text-sm font-medium text-green-600 hover:text-green-700">Email Support →</button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

          {/* Category Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 text-left">
                    <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-gray-900">{faq.question}</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Need more help?</h3>
          <p className="text-green-800 mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              Email Support
            </button>
            <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
