import { callMethod } from './client.js';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  responsibleId: string;
  createdBy: string;
  responsible?: { id: string; name: string };
  creator?: { id: string; name: string };
  createdDate: string;
  closedDate: string;
  deadline: string;
  timeEstimate: string;
  timeSpentInLogs: string;
  group?: { id: string; name: string };
  groupId: string;
  stageId: string;
  statusComplete: string;
}

export interface TaskComment {
  ID: string;
  AUTHOR_ID: string;
  AUTHOR_NAME: string;
  POST_MESSAGE: string;
  POST_DATE: string;
}

export interface ElapsedItem {
  ID: string;
  USER_ID: string;
  MINUTES: string;
  SECONDS: string;
  COMMENT_TEXT: string;
  CREATED_DATE: string;
}

export interface Stage {
  ID: string;
  TITLE: string;
  SORT: string;
  COLOR: string;
  ENTITY_ID: string;
}

export const STATUS_MAP: Record<string, string> = {
  '2': 'Kutilmoqda',
  '3': 'Bajarilmoqda',
  '4': 'Kutish (nazorat)',
  '5': 'Tugallangan',
  '6': 'Kechiktirilgan',
  '1': 'Yangi',
};

export const PRIORITY_MAP: Record<string, string> = {
  '0': 'Past',
  '1': 'O\'rtacha',
  '2': 'Yuqori',
};

export async function getMyTasks(params: Record<string, any> = {}): Promise<{ tasks: Task[]; total: number }> {
  const result = await callMethod('tasks.task.list', {
    order: { ID: 'desc' },
    filter: { RESPONSIBLE_ID: params.userId || 0, ...params.filter },
    select: ['*', 'UF_*'],
    start: params.start || 0,
  });
  return { tasks: result.tasks || [], total: result.total || 0 };
}

export async function getTask(taskId: string): Promise<Task> {
  const result = await callMethod('tasks.task.get', { taskId, select: ['*', 'UF_*'] });
  return result.task;
}

export async function updateTask(taskId: string, fields: Record<string, any>): Promise<void> {
  await callMethod('tasks.task.update', { taskId, fields });
}

export async function createTask(fields: Record<string, any>): Promise<any> {
  return await callMethod('tasks.task.add', { fields });
}

export async function completeTask(taskId: string): Promise<void> {
  await callMethod('tasks.task.complete', { taskId });
}

export async function startTask(taskId: string): Promise<void> {
  await callMethod('tasks.task.start', { taskId });
}

export async function pauseTask(taskId: string): Promise<void> {
  await callMethod('tasks.task.pause', { taskId });
}

export async function deferTask(taskId: string): Promise<void> {
  await callMethod('tasks.task.defer', { taskId });
}

export async function renewTask(taskId: string): Promise<void> {
  await callMethod('tasks.task.renew', { taskId });
}

// Comments
export async function getComments(taskId: string): Promise<TaskComment[]> {
  const result = await callMethod('task.commentitem.getlist', { TASKID: taskId });
  return Array.isArray(result) ? result : [];
}

export async function addComment(taskId: string, message: string): Promise<any> {
  return await callMethod('task.commentitem.add', {
    TASKID: taskId,
    FIELDS: { POST_MESSAGE: message },
  });
}

// Time tracking
export async function getElapsedTime(taskId: string): Promise<ElapsedItem[]> {
  const result = await callMethod('task.elapseditem.getlist', { TASKID: taskId });
  return Array.isArray(result) ? result : [];
}

export async function addElapsedTime(taskId: string, seconds: number, comment: string = ''): Promise<any> {
  return await callMethod('task.elapseditem.add', {
    TASKID: taskId,
    ARFIELDS: { SECONDS: seconds, COMMENT_TEXT: comment },
  });
}

// Stages (Kanban)
export async function getStages(groupId: string = '0'): Promise<Record<string, Stage>> {
  return await callMethod('task.stages.get', {
    entityId: groupId === '0' ? 0 : groupId,
    isAdmin: 'N',
  });
}

export async function moveTaskToStage(taskId: string, stageId: string): Promise<void> {
  await callMethod('task.stages.movetask', { id: taskId, stageId });
}

// Delegate
export async function delegateTask(taskId: string, userId: string): Promise<void> {
  await callMethod('tasks.task.delegate', { taskId, userId });
}
