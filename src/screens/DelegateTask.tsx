import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Header } from '../components/Header.js';
import { Loading } from '../components/Loading.js';
import { ErrorMessage } from '../components/ErrorMessage.js';
import { useAsync } from '../hooks/useAsync.js';
import { delegateTask, type Task } from '../api/tasks.js';
import { getUsers, formatUserName } from '../api/users.js';
import { t } from '../i18n/index.js';

interface DelegateTaskProps {
  task: Task;
  onDone: () => void;
  onBack: () => void;
}

export function DelegateTask({ task, onDone, onBack }: DelegateTaskProps) {
  const { data: users, loading, error: fetchError } = useAsync(() => getUsers({ ACTIVE: true }), []);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useInput((_input: string, key: any) => {
    if (key.escape && !processing) onBack();
    if (success && key.return) onDone();
  });

  if (loading) return <Loading message={t('delegate.loading')} />;
  if (fetchError) return <ErrorMessage message={fetchError} />;
  if (processing) return <Loading message={t('delegate.changing')} />;

  if (success) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>{t('delegate.changed')}</Text>
        <Text dimColor>{t('app.press_enter')}</Text>
      </Box>
    );
  }

  const items = (users || []).map(user => ({
    label: `${formatUserName(user)} (ID: ${user.ID})`,
    value: user.ID,
  }));

  const handleSelect = async (item: { value: string }) => {
    setProcessing(true);
    setError(null);
    try {
      await delegateTask(task.id, item.value);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <Box flexDirection="column">
      <Header
        title={`${t('delegate.title')} - #${task.id}`}
        subtitle={`${t('delegate.current')}: ${task.responsible?.name || task.responsibleId} | ${t('app.press_esc')}`}
      />
      {error && <ErrorMessage message={error} />}
      <Text bold color="cyan">{t('delegate.select')}</Text>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
}
