import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response('Webhook secret is missing', { status: 400 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const body = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Unauthorized', {
      status: 401,
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { email_addresses, first_name, last_name, image_url } = evt.data

    const email = email_addresses[0]?.email_address

    if (!email) {
      return new Response('Error: No email found', { status: 400 })
    }

    try {
      await prisma.user.create({
        data: {
          id: id as string,
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || email,
          avatar: image_url || undefined,
        },
      })
      console.log(`✅ Created user: ${email}`)
    } catch (error) {
      console.error('Error creating user:', error)
      return new Response('Error: Could not create user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { email_addresses, first_name, last_name, image_url } = evt.data

    const email = email_addresses[0]?.email_address

    if (!email) {
      return new Response('Error: No email found', { status: 400 })
    }

    try {
      await prisma.user.update({
        where: { id: id as string },
        data: {
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || email,
          avatar: image_url || undefined,
        },
      })
      console.log(`✅ Updated user: ${email}`)
    } catch (error) {
      console.error('Error updating user:', error)
      return new Response('Error: Could not update user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { id: id as string },
      })
      console.log(`✅ Deleted user: ${id}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      return new Response('Error: Could not delete user', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}
