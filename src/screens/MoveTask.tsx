import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Header } from '../components/Header.js';
import { Loading } from '../components/Loading.js';
import { ErrorMessage } from '../components/ErrorMessage.js';
import { useAsync } from '../hooks/useAsync.js';
import { getStages, moveTaskToStage, type Task } from '../api/tasks.js';
import { t } from '../i18n/index.js';

interface MoveTaskProps {
  task: Task;
  onDone: () => void;
  onBack: () => void;
}

export function MoveTask({ task, onDone, onBack }: MoveTaskProps) {
  const { data: stages, loading, error: fetchError } = useAsync(
    () => getStages(task.groupId || '0'),
    [task.groupId]
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useInput((_input: string, key: any) => {
    if (key.escape && !processing) onBack();
    if (success && key.return) onDone();
  });

  if (loading) return <Loading message={t('stage.loading')} />;
  if (fetchError) return <ErrorMessage message={fetchError} />;
  if (processing) return <Loading message={t('stage.moving')} />;

  if (success) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>{t('stage.moved')}</Text>
        <Text dimColor>{t('app.press_enter')}</Text>
      </Box>
    );
  }

  const stageEntries = stages ? Object.entries(stages) : [];

  if (stageEntries.length === 0) {
    return (
      <Box flexDirection="column">
        <Header title={t('stage.title')} />
        <Text dimColor>{t('stage.empty')}</Text>
        <Text dimColor>{t('app.press_esc')}</Text>
      </Box>
    );
  }

  const items = stageEntries.map(([_key, stage]) => ({
    label: `${stage.TITLE}${stage.ID === task.stageId ? ` ${t('stage.current')}` : ''}`,
    value: stage.ID,
  }));

  const handleSelect = async (item: { value: string }) => {
    if (item.value === task.stageId) { onBack(); return; }
    setProcessing(true);
    setError(null);
    try {
      await moveTaskToStage(task.id, item.value);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <Box flexDirection="column">
      <Header title={`${t('stage.title')} - #${task.id}`} subtitle={t('app.press_esc')} />
      {error && <ErrorMessage message={error} />}
      <Text bold color="cyan">{t('stage.select')}</Text>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
}
