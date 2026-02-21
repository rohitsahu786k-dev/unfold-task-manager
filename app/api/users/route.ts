import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, role' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        avatar: body.avatar,
        timezone: body.timezone,
        role: body.role,
        status: body.status || 'active',
        agencyId: body.agency_id,
        password: body.password,
        notificationPreferences: body.notificationPreferences
          ? {
              create: body.notificationPreferences,
            }
          : undefined,
      },
      include: {
        notificationPreferences: true,
      },
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
