// Core system types for UnfoldCRO

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'developer' | 'agency_user';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  permissions: Permission[];
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
  role: UserRole;
  agency_id?: string;
  profileImage?: string;
  password?: string;
  status?: 'active' | 'inactive';
  notificationPreferences?: {
    email: boolean;
    inApp: boolean;
    slack: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  description: string;
  resource_type: string;
  resource_id?: string;
  timestamp: string;
  ip_address?: string;
}

export interface Agency {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  contact_person?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  agency_id?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  contact_person?: string;
  internal_notes?: string;
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 
  | 'pending_intake' 
  | 'in_progress' 
  | 'awaiting_review' 
  | 'approved'
  | 'completed' 
  | 'on_hold';

export type ProjectType = 
  | 'website_design' 
  | 'website_development' 
  | 'ecommerce' 
  | 'app_development' 
  | 'branding' 
  | 'other';

export type PricingModel = 'fixed' | 'hourly' | 'retainer';

export type WebsiteCategory = 
  | 'corporate' 
  | 'ecommerce' 
  | 'saas' 
  | 'blog' 
  | 'portfolio' 
  | 'other';

export interface Project {
  id: string;
  name: string;
  agency_id: string;
  client_id: string;
  status: ProjectStatus;
  type: ProjectType;
  website_category?: WebsiteCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  pricing_model: PricingModel;
  deadline: string;
  created_by: string;
  assigned_manager?: string;
  requirement_notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  technical_vault?: TechnicalVault;
  files?: ProjectFile[];
  tasks?: Task[];
  meetings?: Meeting[];
  activity_logs?: ActivityLog[];
}

export interface TechnicalVault {
  id: string;
  project_id: string;
  temporary_domain?: string;
  live_domain?: string;
  hosting?: string;
  server?: string;
  technical_notes?: string;
  credential_location?: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'blocked' 
  | 'waiting' 
  | 'sent_for_review' 
  | 'approved' 
  | 'completed' 
  | 'changes_requested';

export interface Task {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assigned_to: string;
  assigned_by: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
  estimated_hours?: number;
  actual_hours?: number;
  review_required: boolean;
  reviewed_by?: string;
  review_comments?: string;
  review_date?: string;
  attachments?: TaskFile[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  marked_for_review_at?: string;
  acceptance_criteria?: string[];
  type?: 'feature' | 'bug' | 'improvement' | 'refactor' | 'other';
}

export interface ProjectFile {
  id: string;
  project_id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  uploaded_by: string;
  protected: boolean;
  created_at: string;
}

export interface TaskFile {
  id: string;
  task_id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  uploaded_by: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link?: string;
  meeting_notes?: string;
  attendees: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  type: 'internal_team' | 'agency' | 'client';
  tags?: string[];
  linked_projects?: string[];
  internal_notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'project_submitted' | 'task_assigned' | 'review_update' | 'deadline_change' | 'file_upload' | 'meeting_reminder';
  title: string;
  message: string;
  related_entity_type?: 'project' | 'task' | 'meeting' | 'file';
  related_entity_id?: string;
  read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  entity_type: 'project' | 'task' | 'file' | 'meeting';
  entity_id: string;
  action: string;
  performed_by: string;
  changes?: Record<string, any>;
  created_at: string;
}

export interface ProjectIntakeForm {
  client_id?: string;
  client_name?: string;
  project_name: string;
  deadline: string;
  type: ProjectType;
  website_category?: WebsiteCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  pricing_model: PricingModel;
  requirement_notes?: string;
  attachments?: File[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  data: any;
}
