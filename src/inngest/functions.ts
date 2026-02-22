import { inngest } from './client'

// Example function: Hello World
export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s')
    return { message: `Hello ${event.data.email}!` }
  }
)

// Task creation event handler
export const onTaskCreated = inngest.createFunction(
  { id: 'on-task-created' },
  { event: 'task/created' },
  async ({ event, step }) => {
    const taskData = await step.run('log-task-creation', async () => {
      console.log('📝 Task created:', event.data)
      return event.data
    })

    // You can add more steps here like sending notifications, updating analytics, etc.
    return taskData
  }
)

// Task assignment event handler
export const onTaskAssigned = inngest.createFunction(
  { id: 'on-task-assigned' },
  { event: 'task/assigned' },
  async ({ event, step }) => {
    await step.run('send-assignment-notification', async () => {
      console.log('🔔 Task assigned:', event.data)
      return { notified: true }
    })

    return { status: 'notification-sent' }
  }
)

// Project created event handler
export const onProjectCreated = inngest.createFunction(
  { id: 'on-project-created' },
  { event: 'project/created' },
  async ({ event, step }) => {
    const projectData = await step.run('log-project-creation', async () => {
      console.log('📁 Project created:', event.data)
      return event.data
    })

    return projectData
  }
)
