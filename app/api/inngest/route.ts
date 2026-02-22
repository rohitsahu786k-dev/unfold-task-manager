import { serve } from 'inngest/next'
import { inngest } from '../../../src/inngest/client'
import { helloWorld, onTaskCreated, onTaskAssigned, onProjectCreated } from '../../../src/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    onTaskCreated,
    onTaskAssigned,
    onProjectCreated,
  ],
})
