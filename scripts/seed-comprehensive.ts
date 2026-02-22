import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from '@/lib/db';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const indianEmployees = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@unfoldcro.com',
    phone: '+91-9876543210',
    timezone: 'IST',
    role: 'super_admin',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@unfoldcro.com',
    phone: '+91-9876543211',
    timezone: 'IST',
    role: 'admin',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Arjun Patel',
    email: 'arjun.patel@unfoldcro.com',
    phone: '+91-9876543212',
    timezone: 'IST',
    role: 'manager',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Neha Singh',
    email: 'neha.singh@unfoldcro.com',
    phone: '+91-9876543213',
    timezone: 'IST',
    role: 'manager',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Vikram Desai',
    email: 'vikram.desai@unfoldcro.com',
    phone: '+91-9876543214',
    timezone: 'IST',
    role: 'developer',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Anjali Verma',
    email: 'anjali.verma@unfoldcro.com',
    phone: '+91-9876543215',
    timezone: 'IST',
    role: 'developer',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Rohan Gupta',
    email: 'rohan.gupta@unfoldcro.com',
    phone: '+91-9876543216',
    timezone: 'IST',
    role: 'developer',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Divya Nair',
    email: 'divya.nair@unfoldcro.com',
    phone: '+91-9876543217',
    timezone: 'IST',
    role: 'agency_user',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Aditya Joshi',
    email: 'aditya.joshi@unfoldcro.com',
    phone: '+91-9876543218',
    timezone: 'IST',
    role: 'agency_user',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Sophia Chatterjee',
    email: 'sophia.chatterjee@unfoldcro.com',
    phone: '+91-9876543219',
    timezone: 'IST',
    role: 'agency_user',
    status: 'active',
    agencyId: 'unfold-cro',
  },
];

const clients = [
  {
    name: 'TechVision India Pvt Ltd',
    email: 'contact@techvision.in',
    phone: '+91-22-4567-8901',
    company: 'TechVision India',
    address: '101, Tech Park, Baner',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411045',
    country: 'India',
    website: 'www.techvision.in',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Anil Reddy',
    email: 'anil.reddy@startupx.com',
    phone: '+91-98765-43210',
    company: 'StartupX Solutions',
    address: '456, Innovation Hub, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560066',
    country: 'India',
    website: 'www.startupx.com',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Priya Kapoor',
    email: 'priya.kapoor@ecommercepro.com',
    phone: '+91-98765-43211',
    company: 'E-Commerce Pro',
    address: '789, Commerce Plaza, DLF Cyber City',
    city: 'Gurgaon',
    state: 'Haryana',
    zipCode: '122002',
    country: 'India',
    website: 'www.ecommercepro.com',
    status: 'active',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Rahul Mehra',
    email: 'rahul.mehra@fintech.in',
    phone: '+91-98765-43212',
    company: 'FinTech Innovations',
    address: '321, Finance Tower, BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400051',
    country: 'India',
    website: 'www.fintech.in',
    status: 'active',
    agencyId: 'unfold-cro',
  },
];

const contacts = [
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@techvision.in',
    phone: '+91-98765-43220',
    designation: 'Product Manager',
    department: 'Product Development',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Sneha Chopra',
    email: 'sneha.chopra@techvision.in',
    phone: '+91-98765-43221',
    designation: 'UI/UX Lead',
    department: 'Design',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Manish Singh',
    email: 'manish.singh@startupx.com',
    phone: '+91-98765-43222',
    designation: 'CTO',
    department: 'Engineering',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Kavya Nath',
    email: 'kavya.nath@ecommercepro.com',
    phone: '+91-98765-43223',
    designation: 'Marketing Manager',
    department: 'Marketing',
    agencyId: 'unfold-cro',
  },
  {
    name: 'Deepak Rao',
    email: 'deepak.rao@fintech.in',
    phone: '+91-98765-43224',
    designation: 'Operations Head',
    department: 'Operations',
    agencyId: 'unfold-cro',
  },
];

const sampleProjects = [
  {
    name: 'E-Commerce Platform Redesign',
    agencyId: 'unfold-cro',
    clientId: null, // Will be updated with actual client ID
    status: 'in_progress',
    type: 'Web Design',
    description: 'Complete redesign of e-commerce platform UI/UX with modern design patterns',
    budget: 150000,
    pricingModel: 'fixed',
    progress: 65,
    internalNotes: 'Client very satisfied with current design phase',
    createdBy: 'rajesh.kumar@unfoldcro.com',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Mobile App Development',
    agencyId: 'unfold-cro',
    clientId: null,
    status: 'in_progress',
    type: 'Mobile App',
    description: 'Native iOS and Android app development for on-demand services',
    budget: 200000,
    pricingModel: 'hourly',
    progress: 45,
    internalNotes: 'MVP ready for beta testing',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'FinTech Dashboard System',
    agencyId: 'unfold-cro',
    clientId: null,
    status: 'pending_intake',
    type: 'Web Development',
    description: 'Real-time financial analytics and reporting dashboard',
    budget: 250000,
    pricingModel: 'fixed',
    progress: 15,
    internalNotes: 'Awaiting final requirements from client',
    createdBy: 'arjun.patel@unfoldcro.com',
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Marketing Website Overhaul',
    agencyId: 'unfold-cro',
    clientId: null,
    status: 'pending_intake',
    type: 'Web Development',
    description: 'New marketing website with SEO optimization',
    budget: 75000,
    pricingModel: 'fixed',
    progress: 10,
    internalNotes: 'Waiting for brand guidelines',
    createdBy: 'arjun.patel@unfoldcro.com',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'API Integration & Enhancement',
    agencyId: 'unfold-cro',
    clientId: null,
    status: 'in_progress',
    type: 'Backend Development',
    description: 'Third-party API integrations and system optimization',
    budget: 120000,
    pricingModel: 'hourly',
    progress: 55,
    internalNotes: 'Integration testing in progress',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
];

const sampleTasks = [
  {
    title: 'Design Homepage Mockups',
    description: 'Create high-fidelity mockups for homepage with all variations',
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 20,
    actualHours: 18,
    assignedTo: 'vikram.desai@unfoldcro.com',
    createdBy: 'arjun.patel@unfoldcro.com',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'API Integration',
    description: 'Integrate backend API with frontend components',
    status: 'not_started',
    priority: 'urgent',
    estimatedHours: 40,
    assignedTo: 'rohan.gupta@unfoldcro.com',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Testing and QA',
    description: 'Comprehensive testing of all features and edge cases',
    status: 'pending_review',
    priority: 'medium',
    estimatedHours: 30,
    actualHours: 24,
    assignedTo: 'anjali.verma@unfoldcro.com',
    createdBy: 'neha.singh@unfoldcro.com',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Database Schema Design',
    description: 'Design and optimize database schema for scalability',
    status: 'completed',
    priority: 'high',
    estimatedHours: 25,
    actualHours: 28,
    assignedTo: 'rohan.gupta@unfoldcro.com',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'UI Component Library',
    description: 'Build reusable UI component library for consistency',
    status: 'in_progress',
    priority: 'medium',
    estimatedHours: 35,
    actualHours: 15,
    assignedTo: 'vikram.desai@unfoldcro.com',
    createdBy: 'arjun.patel@unfoldcro.com',
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize application performance and load times',
    status: 'blocked',
    priority: 'high',
    estimatedHours: 20,
    assignedTo: 'rohan.gupta@unfoldcro.com',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Documentation',
    description: 'Technical documentation for APIs and components',
    status: 'not_started',
    priority: 'low',
    estimatedHours: 15,
    assignedTo: 'rajesh.kumar@unfoldcro.com',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
];

const timesheetData: Array<{
  userId: string;
  hoursWorked: number;
  description: string;
  status: string;
  date: Date;
  projectId?: string | null;
  taskId?: string | null;
  notes?: string | null;
}> = [];
for (let i = 0; i < 30; i++) {
  timesheetData.push({
    userId: 'vikram.desai@unfoldcro.com',
    hoursWorked: Math.random() * 2 + 6, // 6-8 hours
    description: `Frontend development work - Day ${i + 1}`,
    status: i < 5 ? 'approved' : i < 10 ? 'submitted' : 'draft',
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  });
  
  timesheetData.push({
    userId: 'rohan.gupta@unfoldcro.com',
    hoursWorked: Math.random() * 2 + 7, // 7-9 hours
    description: `Backend development and API work - Day ${i + 1}`,
    status: i < 8 ? 'approved' : i < 15 ? 'submitted' : 'draft',
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  });
  
  timesheetData.push({
    userId: 'anjali.verma@unfoldcro.com',
    hoursWorked: Math.random() * 2 + 6, // 6-8 hours
    description: `QA and testing work - Day ${i + 1}`,
    status: i < 3 ? 'approved' : i < 9 ? 'submitted' : 'draft',
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  });
}

const calendarEvents = [
  {
    title: 'Project Kickoff Meeting - E-Commerce Platform',
    description: 'Initial discussion and requirement gathering',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    location: 'Conference Room A',
    attendees: ['rajesh.kumar@unfoldcro.com', 'arjun.patel@unfoldcro.com'],
    eventType: 'meeting',
    createdBy: 'rajesh.kumar@unfoldcro.com',
  },
  {
    title: 'Design Review Session',
    description: 'Review mockups and design decisions with team',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    location: 'Zoom',
    attendees: ['vikram.desai@unfoldcro.com', 'arjun.patel@unfoldcro.com', 'neha.singh@unfoldcro.com'],
    eventType: 'meeting',
    createdBy: 'arjun.patel@unfoldcro.com',
  },
  {
    title: 'Demo Presentation - Mobile App MVP',
    description: 'Showcasing MVP to client for feedback',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
    location: 'Client Office - Mumbai',
    attendees: ['priya.sharma@unfoldcro.com', 'rohan.gupta@unfoldcro.com'],
    eventType: 'meeting',
    createdBy: 'priya.sharma@unfoldcro.com',
  },
  {
    title: 'Sprint Planning - Week 12',
    description: 'Sprint planning for next two weeks',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
    location: 'Meeting Room B',
    attendees: ['rajesh.kumar@unfoldcro.com', 'priya.sharma@unfoldcro.com', 'arjun.patel@unfoldcro.com'],
    eventType: 'meeting',
    createdBy: 'rajesh.kumar@unfoldcro.com',
  },
  {
    title: 'Project Deadline - E-Commerce Redesign Phase 1',
    description: 'Submission of Phase 1 deliverables',
    startTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    location: 'N/A',
    attendees: ['arjun.patel@unfoldcro.com', 'rajesh.kumar@unfoldcro.com'],
    eventType: 'deadline',
    createdBy: 'rajesh.kumar@unfoldcro.com',
  },
  {
    title: 'Team Retrospective',
    description: 'Sprint retrospective and team sync',
    startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    location: 'Zoom',
    attendees: ['rajesh.kumar@unfoldcro.com', 'priya.sharma@unfoldcro.com', 'arjun.patel@unfoldcro.com', 'neha.singh@unfoldcro.com'],
    eventType: 'meeting',
    createdBy: 'neha.singh@unfoldcro.com',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await prisma.timesheet.deleteMany({});
    await prisma.calendarEvent.deleteMany({});
    await prisma.activityLog.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.contact.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.notificationPreferences.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // 1. Create Users
    console.log('👥 Creating employees...');
    const createdUsers = await prisma.user.createMany({
      data: indianEmployees,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdUsers.count} employees\n`);

    // 2. Create Clients
    console.log('🏢 Creating clients...');
    const createdClients = await prisma.client.createMany({
      data: clients,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdClients.count} clients\n`);

    // Get the created clients
    const clientList = await prisma.client.findMany({});

    // 3. Create Contacts (associate with clients)
    console.log('📇 Creating contacts...');
    const contactsWithClientId = contacts.map((contact, index) => ({
      ...contact,
      clientId: clientList[index % clientList.length].id,
    }));

    const createdContacts = await prisma.contact.createMany({
      data: contactsWithClientId,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdContacts.count} contacts\n`);

    // 4. Create Projects (associate with clients)
    console.log('📋 Creating projects...');
    const projectsWithClientId = sampleProjects.map((project, index) => ({
      ...project,
      clientId: clientList[index % clientList.length].id,
    }));

    const createdProjects = await prisma.project.createMany({
      data: projectsWithClientId,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdProjects.count} projects\n`);

    // Get the created projects
    const projectList = await prisma.project.findMany({});

    // 5. Create Tasks (associate with projects)
    console.log('✅ Creating tasks...');
    const tasksWithProjectId = sampleTasks.map((task, index) => ({
      ...task,
      projectId: projectList[index % projectList.length].id,
    }));

    const createdTasks = await prisma.task.createMany({
      data: tasksWithProjectId,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdTasks.count} tasks\n`);

    // 6. Create Timesheets
    console.log('⏱️  Creating timesheets...');
    const createdTimesheets = await prisma.timesheet.createMany({
      data: timesheetData,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdTimesheets.count} timesheet entries\n`);

    // 7. Create Calendar Events
    console.log('📅 Creating calendar events...');
    const createdEvents = await prisma.calendarEvent.createMany({
      data: calendarEvents,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${createdEvents.count} calendar events\n`);

    // Success summary
    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   ✅ ${createdUsers.count} employees`);
    console.log(`   🏢 ${createdClients.count} clients`);
    console.log(`   📇 ${createdContacts.count} contacts`);
    console.log(`   📋 ${createdProjects.count} projects`);
    console.log(`   ✅ ${createdTasks.count} tasks`);
    console.log(`   ⏱️  ${createdTimesheets.count} timesheet entries`);
    console.log(`   📅 ${createdEvents.count} calendar events\n`);

    console.log('🎉 All data ready for development!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
