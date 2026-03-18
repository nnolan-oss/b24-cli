import { callMethod } from "./client.js";

export interface User {
  ID: string;
  NAME: string;
  LAST_NAME: string;
  SECOND_NAME?: string;
  EMAIL: string;
  PERSONAL_PHOTO: string;
  PERSONAL_PHONE?: string;
  PERSONAL_MOBILE?: string;
  PERSONAL_BIRTHDAY?: string;
  PERSONAL_GENDER?: string;
  WORK_POSITION?: string;
  WORK_PHONE?: string;
  WORK_COMPANY?: string;
  UF_SKYPE?: string;
  UF_PHONE_INNER?: string;
  IS_ONLINE?: string;
  LAST_LOGIN?: string;
}

export async function getCurrentUser(): Promise<User> {
  return await callMethod("user.current");
}

export async function getUsers(
  filter: Record<string, any> = {},
): Promise<User[]> {
  return await callMethod("user.get", { filter, start: 0 });
}

export async function getUser(userId: string): Promise<User[]> {
  return await callMethod("user.get", { ID: userId });
}

export async function updateUser(
  id: string,
  fields: Record<string, any>,
): Promise<void> {
  await callMethod("user.update", { ID: id, ...fields });
}

export function formatUserName(user: User): string {
  return `${user.NAME || ""} ${user.LAST_NAME || ""}`.trim();
}

export interface Project {
  ID: string;
  NAME: string;
}

export async function getProjects(): Promise<Project[]> {
  const result = await callMethod("sonet_group.get", {
    ORDER: { NAME: "ASC" },
  });
  return Array.isArray(result) ? result : [];
}
