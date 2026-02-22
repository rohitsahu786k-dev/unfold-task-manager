import { Inngest } from 'inngest'

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: 'unfold-task-manager',
  apiKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
})
