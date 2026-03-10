import Conf from 'conf';

interface ConfigSchema {
  webhookUrl: string;
  userId: string;
  locale: string;
}

const config = new Conf<ConfigSchema>({
  projectName: 'b24-cli',
  schema: {
    webhookUrl: {
      type: 'string',
      default: '',
    },
    userId: {
      type: 'string',
      default: '',
    },
    locale: {
      type: 'string',
      default: 'en',
    },
  },
});

export function getWebhookUrl(): string {
  return config.get('webhookUrl');
}

export function setWebhookUrl(url: string): void {
  const cleaned = url.endsWith('/') ? url : url + '/';
  config.set('webhookUrl', cleaned);
}

export function getUserId(): string {
  return config.get('userId');
}

export function setUserId(id: string): void {
  config.set('userId', id);
}

export function isAuthenticated(): boolean {
  return !!config.get('webhookUrl');
}

export function clearConfig(): void {
  config.clear();
}

export default config;
