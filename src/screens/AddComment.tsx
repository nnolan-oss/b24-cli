import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Header } from '../components/Header.js';
import { Loading } from '../components/Loading.js';
import { ErrorMessage } from '../components/ErrorMessage.js';
import { addComment, type Task } from '../api/tasks.js';
import { t } from '../i18n/index.js';

interface AddCommentProps {
  task: Task;
  onDone: () => void;
  onBack: () => void;
}

export function AddComment({ task, onDone, onBack }: AddCommentProps) {
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useInput((_input: string, key: any) => {
    if (key.escape && !processing) onBack();
    if (success && key.return) onDone();
  });

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;
    setProcessing(true);
    setError(null);
    try {
      await addComment(task.id, value);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (processing && !success) return <Loading message={t('comments.sending')} />;

  if (success) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>{t('comments.sent')}</Text>
        <Text dimColor>{t('app.press_enter')}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header title={`${t('comments.add_title')} - #${task.id}`} subtitle={`${t('comments.mention_help')} | ${t('app.press_esc')}`} />
      {error && <ErrorMessage message={error} />}
      <Box marginTop={1}>
        <Text color="cyan">{t('comments.label')}: </Text>
        <TextInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          placeholder={t('comments.placeholder')}
        />
      </Box>
      <Text dimColor>{t('comments.press_enter')}</Text>
    </Box>
  );
}
