import { NextResponse } from 'next/server'
import { inngest } from '../../../src/inngest/client'

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic'

// Test endpoint to trigger Inngest events
export async function GET() {
  try {
    // Send test event
    await inngest.send({
      name: 'test/hello.world',
      data: {
        email: 'testUser@example.com',
      },
    })

    return NextResponse.json({ 
      message: 'Event sent!',
      status: 'success'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Failed to send event',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
