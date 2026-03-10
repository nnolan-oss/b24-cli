import React from 'react';
import { Box, Text } from 'ink';
import { t } from '../i18n/index.js';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold color="cyan">{` ${t('app.name')} `}</Text>
        <Text bold color="white"> {title}</Text>
      </Box>
      {subtitle && (
        <Text dimColor>{subtitle}</Text>
      )}
      <Text dimColor>{'─'.repeat(60)}</Text>
    </Box>
  );
}
