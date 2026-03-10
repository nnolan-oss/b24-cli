import React from 'react';
import { Box, Text } from 'ink';
import { t } from '../i18n/index.js';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Box marginY={1}>
      <Text color="red" bold>{` ${t('app.error')} `}</Text>
      <Text color="red"> {message}</Text>
    </Box>
  );
}
