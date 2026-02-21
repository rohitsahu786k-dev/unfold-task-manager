import mongoose from 'mongoose';
import { UserRole, ProjectStatus, PricingModel } from '@/app/types/index';

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    avatar: String,
    timezone: String,
    role: { 
      type: String, 
      enum: ['super_admin', 'admin', 'manager', 'developer', 'agency_user'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'],
      default: 'active'
    },
    agency_id: String,
    password: String,
    notificationPreferences: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      slack: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Project Schema
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    agency_id: { type: String, required: true },
    client_id: String,
    status: { 
      type: String, 
      enum: ['pending_intake', 'in_progress', 'awaiting_review', 'approved', 'completed', 'on_hold'],
      default: 'pending_intake'
    },
    type: String,
    description: String,
    budget: Number,
    pricing_model: { 
      type: String, 
      enum: ['fixed', 'hourly', 'retainer']
    },
    deadline: Date,
    progress: { type: Number, default: 0 },
    internal_notes: String,
    attachments: [String],
    created_by: String,
  },
  { timestamps: true }
);

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    project_id: String,
    assigned_to: String,
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'blocked', 'pending_review', 'completed'],
      default: 'not_started'
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    estimated_hours: Number,
    actual_hours: Number,
    deadline: Date,
    acceptance_criteria: String,
    attachments: [String],
    created_by: String,
  },
  { timestamps: true }
);

// Activity Log Schema
const activityLogSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    action: String,
    description: String,
    resource_type: String,
    resource_id: String,
    ip_address: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    company: String,
    type: { type: String, enum: ['client', 'agency', 'developer', 'other'] },
    tags: [String],
    linked_projects: [String],
    created_by: String,
  },
  { timestamps: true }
);

// Client Schema
const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    agency_id: String,
    email: String,
    phone: String,
    company: String,
    website: String,
    contact_person: String,
    internal_notes: String,
    tags: [String],
    created_by: String,
  },
  { timestamps: true }
);

// Meeting Schema
const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    attendees: [String],
    date: Date,
    time: String,
    duration: Number,
    location: String,
    meeting_link: String,
    notes: String,
    project_id: String,
    created_by: String,
  },
  { timestamps: true }
);

// Agency Schema
const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    address: String,
    website: String,
    contact_person: String,
    status: { 
      type: String, 
      enum: ['active', 'inactive'],
      default: 'active'
    },
  },
  { timestamps: true }
);

// Export models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
export const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
export const Agency = mongoose.models.Agency || mongoose.model('Agency', agencySchema);
