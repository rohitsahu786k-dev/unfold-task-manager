import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'unfold-task-manager',
  name: 'UnfoldTaskManager',
  apiKey: process.env.INNGEST_EVENT_KEY,
})
