import { prisma } from '@/lib/db';

export async function initializeDatabase() {
  try {
    // Check if data already exists
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      console.log('⚠️  Database is empty. Run "npm run seed" to populate with initial data.');
      return {
        status: 'empty',
        message: 'Database is empty. Run "npm run seed" to populate with initial data.',
        userCount: 0,
      };
    }

    console.log(`✅ Database is initialized with ${userCount} users`);

    // Get counts for all entities
    const projectCount = await prisma.project.count();
    const taskCount = await prisma.task.count();
    const clientCount = await prisma.client.count();
    const contactCount = await prisma.contact.count();
    const timesheetCount = await prisma.timesheet.count();
    const eventCount = await prisma.calendarEvent.count();

    return {
      status: 'initialized',
      message: 'Database is initialized and ready',
      counts: {
        users: userCount,
        projects: projectCount,
        tasks: taskCount,
        clients: clientCount,
        contacts: contactCount,
        timesheets: timesheetCount,
        calendarEvents: eventCount,
      },
    };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

