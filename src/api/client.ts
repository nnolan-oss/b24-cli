import axios, { AxiosInstance } from 'axios';
import { getWebhookUrl } from '../utils/config.js';

let client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  const url = getWebhookUrl();
  if (!url) {
    throw new Error('Webhook URL sozlanmagan. Avval "bitrix24-cli login <url>" buyrug\'ini bajaring.');
  }
  if (!client) {
    client = axios.create({
      baseURL: url,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return client;
}

export function resetClient(): void {
  client = null;
}

export async function callMethod<T = any>(method: string, params: Record<string, any> = {}): Promise<T> {
  const api = getClient();
  const { data } = await api.post(`${method}.json`, params);
  if (data.error) {
    throw new Error(`Bitrix24 xatosi: ${data.error_description || data.error}`);
  }
  return data.result;
}
