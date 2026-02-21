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

const sampleProjects = [
  {
    name: 'E-Commerce Platform Redesign',
    agencyId: 'unfold-cro',
    status: 'in_progress',
    type: 'Web Design',
    description: 'Complete redesign of e-commerce platform UI/UX',
    budget: 150000,
    pricingModel: 'fixed',
    progress: 65,
    createdBy: 'rajesh.kumar@unfoldcro.com',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Mobile App Development',
    agencyId: 'unfold-cro',
    status: 'in_progress',
    type: 'Mobile App',
    description: 'Native iOS and Android app development',
    budget: 200000,
    pricingModel: 'hourly',
    progress: 45,
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Marketing Website',
    agencyId: 'unfold-cro',
    status: 'pending_intake',
    type: 'Web Development',
    description: 'New marketing website for tech startup',
    budget: 75000,
    pricingModel: 'fixed',
    progress: 10,
    createdBy: 'arjun.patel@unfoldcro.com',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
];

const sampleTasks = [
  {
    title: 'Design Homepage Mockups',
    description: 'Create high-fidelity mockups for homepage',
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 20,
    assignedTo: 'vikram.desai@unfoldcro.com',
    createdBy: 'arjun.patel@unfoldcro.com',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'API Integration',
    description: 'Integrate backend API with frontend',
    status: 'not_started',
    priority: 'urgent',
    estimatedHours: 40,
    assignedTo: 'rohan.gupta@unfoldcro.com',
    createdBy: 'priya.sharma@unfoldcro.com',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Testing and QA',
    description: 'Comprehensive testing of all features',
    status: 'pending_review',
    priority: 'medium',
    estimatedHours: 30,
    assignedTo: 'anjali.verma@unfoldcro.com',
    createdBy: 'neha.singh@unfoldcro.com',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.activityLog.deleteMany({});
    await prisma.notificationPreferences.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Insert employees
    console.log('👥 Creating Indian employees...');
    const createdUsers = await prisma.user.createMany({
      data: indianEmployees,
      skipDuplicates: true,
    });
    console.log(`✅ Added ${createdUsers.count} Indian employees\n`);

    // Insert sample projects
    console.log('📋 Creating sample projects...');
    const createdProjects = await prisma.project.createMany({
      data: sampleProjects,
      skipDuplicates: true,
    });
    console.log(`✅ Added ${createdProjects.count} sample projects\n`);

    // Get created projects for task assignments
    const projects = await prisma.project.findMany({});

    // Create sample tasks with project associations
    console.log('✅ Creating sample tasks...');
    const tasksWithProjects = sampleTasks.map((task, index) => ({
      ...task,
      projectId: projects[index % projects.length].id,
    }));

    const createdTasks = await prisma.task.createMany({
      data: tasksWithProjects,
      skipDuplicates: true,
    });
    console.log(`✅ Added ${createdTasks.count} sample tasks\n`);

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${createdUsers.count} employees added`);
    console.log(`   - ${createdProjects.count} projects created`);
    console.log(`   - ${createdTasks.count} tasks assigned\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
