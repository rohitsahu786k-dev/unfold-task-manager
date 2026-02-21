'use client';

import { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Info,
  Paperclip,
  Smile,
  Send,
  Shield,
  Users,
  Building2,
  Download,
  Wifi,
  WifiOff,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Video,
  Phone,
  Mail,
  Globe,
  Clock,
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_USERS } from '../types/mockData';

type ChatType = 'project' | 'direct';
type Role =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'developer'
  | 'agency_user';

interface AttachmentMeta {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'sheet' | 'zip' | 'video' | 'other';
  progress?: number;
}

interface Message {
  id: string;
  senderId?: string;
  content?: string;
  timestamp: string;
  isSystem?: boolean;
  isAgency?: boolean;
  attachments?: AttachmentMeta[];
  seen?: boolean;
  reactions?: string[];
}

interface ChatSummary {
  id: string;
  name: string;
  type: ChatType;
  projectId?: string;
  userId?: string;
  clientName?: string;
  agencyName?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  memberCount?: number;
  allowedRoles: Role[];
  managerIds?: string[];
  developerIds?: string[];
  agencyId?: string;
  typingUsers?: string[];
}

const getAttachmentIcon = (type: AttachmentMeta['type']) => {
  switch (type) {
    case 'image':
      return ImageIcon;
    case 'doc':
    case 'pdf':
      return FileText;
    case 'sheet':
      return FileSpreadsheet;
    case 'zip':
      return FileArchive;
    case 'video':
      return Video;
    default:
      return FileText;
  }
};

const formatRole = (role: Role) =>
  role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const CHAT_SUMMARIES: ChatSummary[] = [
  {
    id: 'chat_project_1',
    name: 'Website Revamp - Sprint 12',
    type: 'project',
    projectId: 'proj_1',
    clientName: 'Design Co.',
    agencyName: 'Creative Studio Pro',
    lastMessage: 'Uploaded the hero copy and QA report for approval.',
    lastTimestamp: '10:24 AM',
    unreadCount: 3,
    memberCount: 12,
    allowedRoles: ['super_admin', 'admin', 'manager'],
    managerIds: ['user_3'],
    typingUsers: ['Alex Kumar'],
  },
  {
    id: 'chat_project_2',
    name: 'Global Commerce Rollout',
    type: 'project',
    projectId: 'proj_2',
    clientName: 'Global Logistics',
    agencyName: 'Digital Solutions Inc',
    lastMessage: 'Agency shared revised backlog for approval.',
    lastTimestamp: '9:05 AM',
    unreadCount: 0,
    memberCount: 18,
    allowedRoles: ['super_admin', 'admin', 'manager', 'developer'],
    developerIds: ['user_4', 'user_5'],
  },
  {
    id: 'chat_project_3',
    name: 'Fashion Sprint - Product Drops',
    type: 'project',
    projectId: 'proj_3',
    clientName: 'Fashion Forward',
    agencyName: 'Creative Studio Pro',
    lastMessage: 'Agency: "Product page animations approved by client."',
    lastTimestamp: 'Yesterday',
    unreadCount: 1,
    memberCount: 9,
    allowedRoles: ['super_admin', 'manager', 'agency_user'],
    agencyId: 'agency_1',
  },
  {
    id: 'chat_direct_1',
    name: 'Emily Watson',
    type: 'direct',
    userId: 'user_3',
    lastMessage: 'Need approval on the CRO experiments doc.',
    lastTimestamp: '11:10 AM',
    unreadCount: 0,
    isOnline: true,
    allowedRoles: ['super_admin', 'admin', 'manager'],
  },
  {
    id: 'chat_direct_2',
    name: 'Agency Contact',
    type: 'direct',
    userId: 'user_6',
    lastMessage: 'Shared the legal sign-off docs. Please review.',
    lastTimestamp: 'Yesterday',
    unreadCount: 2,
    isOnline: false,
    allowedRoles: ['super_admin', 'manager', 'agency_user'],
    agencyId: 'agency_1',
  },
];

const CHAT_MESSAGES: Record<string, Message[]> = {
  chat_project_1: [
    {
      id: 'msg_1',
      senderId: 'user_4',
      content: 'Updated the sprint board. QA comments resolved.',
      timestamp: '09:48 AM',
    },
    {
      id: 'msg_2',
      isSystem: true,
      content: 'Task marked as completed by Sarah Chen',
      timestamp: '09:59 AM',
    },
    {
      id: 'msg_3',
      senderId: 'user_6',
      content: 'Uploaded the new hero section copy and QA report.',
      timestamp: '10:21 AM',
      isAgency: true,
      attachments: [
        {
          id: 'att_1',
          name: 'Hero-Copy-v4.docx',
          size: '1.2 MB',
          type: 'doc',
        },
        {
          id: 'att_2',
          name: 'QA-report.pdf',
          size: '2.4 MB',
          type: 'pdf',
        },
      ],
      reactions: ['\u{1F44D}', '\u{1F525}'],
    },
    {
      id: 'msg_4',
      senderId: 'user_3',
      content: 'Great progress. Approved for deployment. \u{1F680}',
      timestamp: '10:24 AM',
      seen: true,
    },
  ],
  chat_project_2: [
    {
      id: 'msg_5',
      senderId: 'user_5',
      content: 'Drafted the migration checklist for review.',
      timestamp: '08:42 AM',
    },
    {
      id: 'msg_6',
      senderId: 'user_4',
      content: 'Need clarity on the payment gateway handoff.',
      timestamp: '09:01 AM',
    },
  ],
  chat_project_3: [
    {
      id: 'msg_7',
      senderId: 'user_6',
      content: 'Product page animations approved by client.',
      timestamp: 'Yesterday',
      isAgency: true,
      attachments: [
        {
          id: 'att_3',
          name: 'Animations-preview.mp4',
          size: '18 MB',
          type: 'video',
          progress: 100,
        },
      ],
    },
  ],
  chat_direct_1: [
    {
      id: 'msg_8',
      senderId: 'user_3',
      content: 'Need approval on the CRO experiments doc.',
      timestamp: '11:10 AM',
    },
  ],
  chat_direct_2: [
    {
      id: 'msg_9',
      senderId: 'user_6',
      content: 'Shared the legal sign-off docs. Please review.',
      timestamp: 'Yesterday',
      isAgency: true,
    },
  ],
};

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'projects' | 'direct' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(CHAT_SUMMARIES[0].id);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [composerValue, setComposerValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(CHAT_MESSAGES);

  const visibleChats = useMemo(() => {
    return CHAT_SUMMARIES.filter((chat) => {
      const roleAllowed = chat.allowedRoles.includes(currentUser.role as Role);
      if (!roleAllowed) return false;

      if (currentUser.role === 'developer' && chat.type === 'project' && chat.developerIds) {
        return chat.developerIds.includes(currentUser.id);
      }

      if (currentUser.role === 'manager' && chat.type === 'project' && chat.managerIds) {
        return chat.managerIds.includes(currentUser.id);
      }

      if (currentUser.role === 'agency_user') {
        if (chat.agencyId && currentUser.agency_id) {
          return chat.agencyId === currentUser.agency_id;
        }
        return chat.type === 'direct' && chat.userId === currentUser.id;
      }

      return true;
    }).filter((chat) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'projects' && chat.type === 'project') ||
        (filter === 'direct' && chat.type === 'direct') ||
        (filter === 'unread' && chat.unreadCount > 0);

      const matchesSearch =
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [currentUser, filter, searchTerm]);

  const activeChat = useMemo(
    () => visibleChats.find((chat) => chat.id === activeChatId) ?? visibleChats[0],
    [activeChatId, visibleChats],
  );

  const activeMessages = activeChat ? messagesMap[activeChat.id] || [] : [];

  const handleSendMessage = () => {
    if (!composerValue.trim() || !activeChat) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      content: composerValue.trim(),
      timestamp: 'Now',
      seen: false,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }));
    setComposerValue('');
    setShowEmojiPicker(false);
  };

  return (
    <DashboardLayout>
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid h-[calc(100vh-140px)] grid-cols-[300px,1fr,360px]">
          {/* Left Panel */}
          <div className="flex flex-col border-r border-gray-100">
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus-within:border-green-500 focus-within:bg-white">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search chats..."
                      className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
                <button className="rounded-full bg-green-500 p-2 text-white shadow hover:bg-green-600" aria-label="New chat">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-600">
                {(['all', 'projects', 'direct', 'unread'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-full px-3 py-1.5 capitalize ${
                      filter === item
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {visibleChats.map((chat) => {
                const isActive = chat.id === activeChat?.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full rounded-2xl border border-transparent p-4 text-left transition-all ${
                      isActive ? 'border-green-200 bg-green-50' : 'hover:border-green-100 hover:bg-green-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{chat.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              chat.type === 'project'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {chat.type === 'project' ? 'Project' : 'Direct'}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">{chat.lastMessage}</p>
                      </div>
                      <div className="text-right text-xs text-gray-400">{chat.lastTimestamp}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {chat.type === 'direct' && (
                          <span
                            className={`flex items-center gap-1 text-[11px] ${
                              chat.isOnline ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${chat.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                            />
                            {chat.isOnline ? 'Online' : 'Offline'}
                          </span>
                        )}
                        {chat.memberCount && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {chat.memberCount}
                          </span>
                        )}
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Panel */}
          <div className="flex flex-col bg-[#F9FAFB]">
            {activeChat ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
                  <div className="space-y-1">
                    {activeChat.type === 'project' && (
                      <>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-semibold text-gray-900">{activeChat.name}</h2>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            {activeChat.agencyName}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {activeChat.clientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            {activeChat.memberCount} members
                          </span>
                          <span className="flex items-center gap-1 text-green-600">
                            <Shield className="h-4 w-4 text-green-500" />
                            Secure workspace
                          </span>
                        </div>
                      </>
                    )}
                    {activeChat.type === 'direct' && (() => {
                      const peer = MOCK_USERS.find((u) => u.id === activeChat.userId);
                      if (!peer) return null;
                      return (
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-lg font-semibold text-green-700">
                            {peer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl font-semibold text-gray-900">{peer.name}</h2>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                {formatRole(peer.role as Role)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                {activeChat.isOnline ? (
                                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <WifiOff className="h-3.5 w-3.5 text-gray-400" />
                                )}
                                {activeChat.isOnline ? 'Online' : 'Offline'}
                              </span>
                              <span>{peer.timezone} timezone</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-3">
                    {activeChat.typingUsers && activeChat.typingUsers.length > 0 && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {activeChat.typingUsers.join(', ')} typing...
                      </span>
                    )}
                    <button
                      onClick={() => setIsDrawerOpen((prev) => !prev)}
                      className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-green-400 hover:text-green-600"
                    >
                      <Info className="mr-1 inline h-4 w-4" />
                      {isDrawerOpen ? 'Hide info' : 'Show info'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
                  {activeMessages.map((message, index) => {
                    if (message.isSystem) {
                      return (
                        <div key={message.id} className="text-center text-xs font-semibold text-gray-400">
                          {message.content}
                        </div>
                      );
                    }

                    const sender = MOCK_USERS.find((u) => u.id === message.senderId);
                    const isAuthor = message.senderId === currentUser.id;
                    return (
                      <div key={message.id} className={`flex ${isAuthor ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-5 py-3 shadow ${
                            isAuthor ? 'rounded-br-md bg-green-500 text-white' : 'rounded-bl-md bg-white text-gray-800'
                          } ${message.isAgency ? 'border-l-4 border-blue-300' : ''}`}
                        >
                          {sender && !isAuthor && (
                            <p className="mb-1 text-xs font-semibold text-gray-500">{sender.name}</p>
                          )}
                          {message.content && <p className="text-sm leading-relaxed">{message.content}</p>}

                          {message.attachments && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((file) => {
                                const Icon = getAttachmentIcon(file.type);
                                return (
                                  <div
                                    key={file.id}
                                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                                      isAuthor ? 'border-white/50' : 'border-gray-200 bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Icon className={`h-5 w-5 ${isAuthor ? 'text-white/80' : 'text-gray-500'}`} />
                                      <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className={`text-xs ${isAuthor ? 'text-white/70' : 'text-gray-500'}`}>{file.size}</p>
                                        {file.progress !== undefined && (
                                          <div className="mt-1 h-1 w-24 rounded-full bg-gray-200">
                                            <div className="h-full rounded-full bg-green-500" style={{ width: `${file.progress}%` }} />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <button className="rounded-full bg-white/20 p-2">
                                      <Download className={`h-4 w-4 ${isAuthor ? 'text-white' : 'text-gray-500'}`} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-3 text-[11px]">
                            <span className={isAuthor ? 'text-white/80' : 'text-gray-500'}>{message.timestamp}</span>
                            {message.reactions && (
                              <div className="flex items-center gap-1 rounded-full bg-black/10 px-2 py-0.5 text-xs text-white">
                                {message.reactions.join(' ')}
                              </div>
                            )}
                            {isAuthor && index === activeMessages.length - 1 && message.seen && (
                              <span className="text-xs text-white/80">Seen</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 bg-white px-8 py-4">
                  <div className="mb-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500">
                    Drag files here or <span className="font-semibold text-green-600">browse</span> to upload briefs, PDFs,
                    videos, or spreadsheets.
                  </div>
                  <div className="flex items-end gap-3">
                    <button className="rounded-2xl border border-gray-200 p-3 text-gray-500 hover:border-green-500 hover:text-green-600">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <div className="flex-1 rounded-[32px] border border-gray-200 bg-gray-50 px-4 py-3">
                      <textarea
                        value={composerValue}
                        onChange={(e) => setComposerValue(e.target.value)}
                        rows={1}
                        placeholder="Type a message..."
                        className="h-10 w-full resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="rounded-2xl border border-gray-200 p-3 text-gray-500 hover:border-green-500 hover:text-green-600"
                      >
                        <Smile className="h-4 w-4" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-14 right-0 w-56 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
                          <p className="mb-2 text-xs font-semibold text-gray-400">Recently used</p>
                          <div className="flex flex-wrap gap-2 text-lg">
                            {['\u{1F44D}', '\u{1F525}', '\u{1F680}', '\u{2705}', '\u{1F440}', '\u{1F4A1}', '\u{1F3AF}'].map(
                              (emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    setComposerValue((prev) => `${prev} ${emoji}`.trim());
                                    setShowEmojiPicker(false);
                                  }}
                                  className="rounded-full px-2 py-1 hover:bg-gray-100"
                                >
                                  {emoji}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!composerValue.trim()}
                      className="rounded-full bg-green-500 p-4 text-white shadow-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                No chat available for your role.
              </div>
            )}
          </div>

          {/* Right Drawer */}
          <div className="relative border-l border-gray-100 bg-white">
            <div
              className={`absolute inset-y-0 right-0 w-full max-w-md transform bg-white transition-transform duration-300 ${
                isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              {activeChat && (
                <div className="h-full overflow-y-auto px-6 py-6">
                  {activeChat.type === 'project'
                    ? (() => {
                        const project = MOCK_PROJECTS.find((p) => p.id === activeChat.projectId);
                        if (!project) return null;
                        return (
                          <div className="space-y-5">
                            <div>
                              <p className="text-xs font-semibold uppercase text-gray-400">Project</p>
                              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                              <p className="text-sm text-gray-500">{project.requirement_notes}</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Status</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                  {project.status.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="mt-3 text-sm text-gray-600">
                                <Clock className="mr-2 inline h-4 w-4 text-gray-400" />
                                Deadline: {new Date(project.deadline).toLocaleDateString()}
                              </div>
                              <div className="mt-4">
                                <p className="text-xs font-semibold uppercase text-gray-400">Progress</p>
                                <div className="mt-2 h-2 rounded-full bg-gray-200">
                                  <div className="h-full rounded-full bg-green-500" style={{ width: '68%' }} />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">68% complete</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase text-gray-400">Security Rules</p>
                              <div className="mt-2 space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-500" />
                                  Agencies see only their projects.
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  Developers view assigned threads only.
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    : (() => {
                        const peer = MOCK_USERS.find((u) => u.id === activeChat.userId);
                        if (!peer) return null;
                        const isAgency = peer.role === 'agency_user';
                        return (
                          <div className="space-y-5">
                            <div className="text-center">
                              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-2xl font-semibold text-green-600">
                                {peer.name.charAt(0)}
                              </div>
                              <h3 className="mt-3 text-lg font-semibold text-gray-900">{peer.name}</h3>
                              <p className="text-sm text-gray-500">{formatRole(peer.role as Role)}</p>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                {peer.email}
                              </div>
                              {peer.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  {peer.phone}
                                </div>
                              )}
                              {peer.timezone && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-gray-400" />
                                  {peer.timezone} timezone
                                </div>
                              )}
                              {isAgency && (
                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                                  Agency hierarchy masked. Access limited to shared projects only.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
