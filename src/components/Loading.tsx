import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  return (
    <Box>
      <Text color="green">
        <Spinner type="dots" />
      </Text>
      <Text> {message || 'Loading...'}</Text>
    </Box>
  );
}
