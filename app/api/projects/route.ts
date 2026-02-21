import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: true,
        client: true,
        tasks: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.agencyId) {
      return NextResponse.json(
        { error: 'Name and agencyId are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        agencyId: body.agencyId,
        clientId: body.clientId,
        status: body.status || 'pending_intake',
        type: body.type,
        description: body.description,
        budget: body.budget,
        pricingModel: body.pricingModel,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        progress: body.progress || 0,
        internalNotes: body.internalNotes,
        createdBy: body.createdBy,
      },
      include: {
        user: true,
        client: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
