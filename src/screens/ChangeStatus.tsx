import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Header } from '../components/Header.js';
import { Loading } from '../components/Loading.js';
import { ErrorMessage } from '../components/ErrorMessage.js';
import { startTask, completeTask, pauseTask, deferTask, renewTask, type Task } from '../api/tasks.js';
import { t } from '../i18n/index.js';

interface ChangeStatusProps {
  task: Task;
  onDone: () => void;
  onBack: () => void;
}

export function ChangeStatus({ task, onDone, onBack }: ChangeStatusProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useInput((_input: string, key: any) => {
    if (key.escape && !processing) onBack();
    if (success && key.return) onDone();
  });

  const statusActions = [
    { label: t('status.start'), value: 'start' },
    { label: t('status.complete'), value: 'complete' },
    { label: t('status.pause'), value: 'pause' },
    { label: t('status.defer'), value: 'defer' },
    { label: t('status.renew'), value: 'renew' },
    { label: t('app.cancel'), value: 'cancel' },
  ];

  const handleSelect = async (item: { value: string }) => {
    if (item.value === 'cancel') { onBack(); return; }
    setProcessing(true);
    setError(null);
    try {
      switch (item.value) {
        case 'start': await startTask(task.id); break;
        case 'complete': await completeTask(task.id); break;
        case 'pause': await pauseTask(task.id); break;
        case 'defer': await deferTask(task.id); break;
        case 'renew': await renewTask(task.id); break;
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (processing) return <Loading message={t('status.changing')} />;

  if (success) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>{t('status.changed')}</Text>
        <Text dimColor>{t('app.press_enter')}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header title={`${t('status.change_title')} - #${task.id}`} subtitle={t('app.press_esc')} />
      <Text dimColor>{t('status.current')}: {task.status}</Text>
      {error && <ErrorMessage message={error} />}
      <SelectInput items={statusActions} onSelect={handleSelect} />
    </Box>
  );
}
