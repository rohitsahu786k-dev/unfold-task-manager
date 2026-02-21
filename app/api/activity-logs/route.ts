import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.userId || !body.userName) {
      return NextResponse.json(
        { error: 'userId and userName are required' },
        { status: 400 }
      );
    }

    const log = await prisma.activityLog.create({
      data: {
        userId: body.userId,
        userName: body.userName,
        action: body.action,
        description: body.description,
        resourceType: body.resourceType,
        resourceId: body.resourceId,
        ipAddress: body.ipAddress,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating activity log:', error);
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    );
  }
}
