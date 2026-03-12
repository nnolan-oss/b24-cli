import { Text } from 'ink';
import { getPriorityLabel, getStatusLabel } from '../i18n/index.js';

const STATUS_COLORS: Record<string, string> = {
  '1': 'gray',
  '2': 'yellow',
  '3': 'blue',
  '4': 'magenta',
  '5': 'green',
  '6': 'red',
};

const PRIORITY_COLORS: Record<string, string> = {
  '0': 'gray',
  '1': 'yellow',
  '2': 'red',
};

export function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || 'white';
  return <Text color={color}>[{getStatusLabel(status)}]</Text>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const color = PRIORITY_COLORS[priority] || 'white';
  return <Text color={color}>{getPriorityLabel(priority)}</Text>;
}
