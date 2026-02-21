// Slack Integration Service

interface SlackMessage {
  channel: string;
  text: string;
  blocks?: unknown[];
  attachments?: unknown[];
  thread_ts?: string;
}

interface TaskNotification {
  taskId: string;
  taskTitle: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  creator: string;
  deadline?: string;
}

const SLACK_WEBHOOK_URL = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || '';

const PRIORITY_COLORS: Record<TaskNotification['priority'], string> = {
  low: '#3498db',
  medium: '#f39c12',
  high: '#e74c3c',
  urgent: '#c0392b',
};

const STATUS_EMOJI: Record<string, string> = {
  not_started: ':white_circle:',
  in_progress: ':construction:',
  blocked: ':no_entry:',
  pending_review: ':hourglass_flowing_sand:',
  sent_for_review: ':hourglass_flowing_sand:',
  completed: ':white_check_mark:',
};

async function postPayload(payload: Record<string, unknown>) {
  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Slack request failed: ${response.status}`);
  }
}

/**
 * Post a task creation notification to Slack
 */
export async function notifyTaskCreated(task: TaskNotification) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not configured');
    return;
  }

  try {
    const payload = {
      text: `:rocket: New Task Created: ${task.taskTitle}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'New Task Created',
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Title:*\n${task.taskTitle}` },
            { type: 'mrkdwn', text: `*Priority:*\n${task.priority.toUpperCase()}` },
            { type: 'mrkdwn', text: `*Assignee:*\n${task.assignee}` },
            { type: 'mrkdwn', text: `*Created By:*\n${task.creator}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${task.description.substring(0, 200)}${
              task.description.length > 200 ? '...' : ''
            }`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Deadline:*\n${task.deadline || 'Not set'}`,
          },
        },
        { type: 'divider' },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Task' },
              url: `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${task.taskId}`,
              style: 'primary',
            },
          ],
        },
      ],
      attachments: [
        {
          color: PRIORITY_COLORS[task.priority],
        },
      ],
    };

    await postPayload(payload);
    console.log('Task notification sent to Slack');
    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}

/**
 * Post a task assignment notification to Slack
 */
export async function notifyTaskAssigned(
  taskId: string,
  taskTitle: string,
  assigneeName: string,
  assignerName: string
) {
  if (!SLACK_WEBHOOK_URL) return;

  try {
    const payload = {
      text: `:busts_in_silhouette: Task Assigned to ${assigneeName}: ${taskTitle}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:busts_in_silhouette: *${assignerName}* assigned "*${taskTitle}*" to *${assigneeName}*`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Task' },
              url: `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`,
            },
          ],
        },
      ],
    };

    await postPayload(payload);
  } catch (error) {
    console.error('Error sending Slack assignment notification:', error);
  }
}

/**
 * Post a task status update notification to Slack
 */
export async function notifyTaskUpdated(
  taskId: string,
  taskTitle: string,
  oldStatus: string,
  newStatus: string,
  updatedBy: string
) {
  if (!SLACK_WEBHOOK_URL) return;

  try {
    const statusEmoji = STATUS_EMOJI[newStatus] || ':information_source:';
    const payload = {
      text: `${statusEmoji} Task Updated: ${taskTitle}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${statusEmoji} *${updatedBy}* updated "*${taskTitle}*"\n${oldStatus} -> *${newStatus}*`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Task' },
              url: `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`,
            },
          ],
        },
      ],
    };

    await postPayload(payload);
  } catch (error) {
    console.error('Error sending Slack update notification:', error);
  }
}

/**
 * Post a daily summary to Slack
 */
export async function sendDailySummary(
  channel: string,
  summary: {
    totalTasks: number;
    completedToday: number;
    inProgress: number;
    overdue: number;
    blockedTasks: number;
  }
) {
  if (!SLACK_WEBHOOK_URL) return;

  try {
    const payload = {
      text: ':bar_chart: Daily Task Summary',
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Daily Task Summary' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Total Tasks:*\n${summary.totalTasks}` },
            { type: 'mrkdwn', text: `*Completed Today:*\n${summary.completedToday}` },
            { type: 'mrkdwn', text: `*In Progress:*\n${summary.inProgress}` },
            { type: 'mrkdwn', text: `*Overdue:*\n${summary.overdue}` },
            { type: 'mrkdwn', text: `*Blocked:*\n${summary.blockedTasks}` },
          ],
        },
      ],
      channel,
    };

    await postPayload(payload);
  } catch (error) {
    console.error('Error sending Slack summary:', error);
  }
}

/**
 * Send custom message to Slack
 */
export async function sendSlackMessage(message: SlackMessage) {
  if (!SLACK_WEBHOOK_URL) return;

  try {
    const payload = {
      channel: message.channel,
      text: message.text,
      blocks: message.blocks,
      attachments: message.attachments,
      thread_ts: message.thread_ts,
    };

    await postPayload(payload);
    return true;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return false;
  }
}
