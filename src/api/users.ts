import { callMethod } from './client.js';

export interface User {
  ID: string;
  NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PERSONAL_PHOTO: string;
}

export async function getCurrentUser(): Promise<User> {
  return await callMethod('user.current');
}

export async function getUsers(filter: Record<string, any> = {}): Promise<User[]> {
  return await callMethod('user.get', { filter, start: 0 });
}

export async function getUser(userId: string): Promise<User[]> {
  return await callMethod('user.get', { ID: userId });
}

export function formatUserName(user: User): string {
  return `${user.NAME || ''} ${user.LAST_NAME || ''}`.trim();
}
