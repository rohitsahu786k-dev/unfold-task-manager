import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        projectId: body.projectId,
        assignedTo: body.assignedTo,
        status: body.status || 'not_started',
        priority: body.priority || 'medium',
        estimatedHours: body.estimatedHours,
        actualHours: body.actualHours,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        acceptanceCriteria: body.acceptanceCriteria,
        createdBy: body.createdBy,
      },
      include: {
        project: true,
        assignee: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
