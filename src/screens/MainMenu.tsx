import { Box, useInput } from "ink";
import SelectInput from "ink-select-input";
import { Header } from "../components/Header.js";
import { t } from "../i18n/index.js";

type Screen =
  | "my-tasks"
  | "all-tasks"
  | "active-tasks"
  | "day-start"
  | "profile"
  | "language"
  | "logout"
  | "exit";

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  useInput((input: string) => {
    if (input === "q") onNavigate("exit");
  });

  const menuItems = [
    { label: t("menu.my_tasks"), value: "my-tasks" as Screen },
    { label: t("menu.all_tasks"), value: "all-tasks" as Screen },
    { label: t("menu.active_tasks"), value: "active-tasks" as Screen },
    { label: t("menu.day_start"), value: "day-start" as Screen },
    { label: t("menu.create_task"), value: "create-task" as Screen },
    { label: t("menu.profile"), value: "profile" as Screen },
    { label: t("menu.language"), value: "language" as Screen },
    { label: t("menu.logout"), value: "logout" as Screen },
    { label: t("menu.exit"), value: "exit" as Screen },
  ];

  return (
    <Box flexDirection="column">
      <Header title={t("menu.title")} subtitle={t("app.press_q")} />
      <SelectInput
        items={menuItems}
        onSelect={(item: { value: Screen }) => onNavigate(item.value)}
      />
    </Box>
  );
}
