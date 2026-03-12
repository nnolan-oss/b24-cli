import axios, { AxiosInstance } from "axios";
import { getWebhookUrl } from "../utils/config.js";
import { t } from "../i18n/index.js";

let client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  const url = getWebhookUrl();
  if (!url) {
    throw new Error(t("auth.not_configured"));
  }
  if (!client) {
    client = axios.create({
      baseURL: url,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });
  }
  return client;
}

export function resetClient(): void {
  client = null;
}

export async function callMethod<T = any>(
  method: string,
  params: Record<string, any> = {},
): Promise<T> {
  const api = getClient();
  const { data } = await api.post(`${method}.json`, params);
  if (data.error) {
    throw new Error(`Bitrix24: ${data.error_description || data.error}`);
  }
  return data.result;
}
