import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const projectId = request.nextUrl.searchParams.get('projectId');

    const where = {} as any;
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;

    const timesheets = await prisma.timesheet.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timesheets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.userId || !body.projectId || !body.date || body.hoursWorked === undefined) {
      return NextResponse.json(
        { error: 'userId, projectId, date, and hoursWorked are required' },
        { status: 400 }
      );
    }

    const timesheet = await prisma.timesheet.create({
      data: {
        userId: body.userId,
        projectId: body.projectId,
        date: new Date(body.date),
        hoursWorked: parseFloat(body.hoursWorked),
        description: body.description || null,
        taskId: body.taskId || null,
      },
    });

    return NextResponse.json(timesheet, { status: 201 });
  } catch (error) {
    console.error('Error creating timesheet:', error);
    return NextResponse.json(
      { error: 'Failed to create timesheet' },
      { status: 500 }
    );
  }
}
