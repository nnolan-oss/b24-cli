import React from 'react';
import { Box, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Header } from '../components/Header.js';
import { t } from '../i18n/index.js';

type Screen = 'my-tasks' | 'all-tasks' | 'language' | 'logout' | 'exit';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  useInput((input: string) => {
    if (input === 'q') onNavigate('exit');
  });

  const menuItems = [
    { label: t('menu.my_tasks'), value: 'my-tasks' as Screen },
    { label: t('menu.all_tasks'), value: 'all-tasks' as Screen },
    { label: t('menu.language'), value: 'language' as Screen },
    { label: t('menu.logout'), value: 'logout' as Screen },
    { label: t('menu.exit'), value: 'exit' as Screen },
  ];

  return (
    <Box flexDirection="column">
      <Header title={t('menu.title')} subtitle={t('app.press_q')} />
      <SelectInput items={menuItems} onSelect={(item: { value: Screen }) => onNavigate(item.value)} />
    </Box>
  );
}
