import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { getMyTasks, type Task } from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";
import { getUserId } from "../utils/config.js";

interface TaskListProps {
  onSelect: (taskId: string) => void;
  onBack: () => void;
  filter?: Record<string, any>;
  title?: string;
}

export function TaskList({
  onSelect,
  onBack,
  filter = {},
  title,
}: TaskListProps) {
  const userId = getUserId();
  const listTitle = title || t("tasks.title");
  const { data, loading, error, refetch } = useAsync(
    () => getMyTasks({ userId, filter }),
    [userId, JSON.stringify(filter)],
  );

  useInput((input: string, key: any) => {
    if (key.escape) onBack();
    if (input === "r") refetch();
  });

  if (loading) return <Loading message={t("tasks.loading")} />;
  if (error) return <ErrorMessage message={error} />;

  const tasks = data?.tasks || [];

  if (tasks.length === 0) {
    return (
      <Box flexDirection="column">
        <Header title={listTitle} />
        <Text dimColor>{t("tasks.empty")}</Text>
        <Text dimColor>{t("app.press_esc")}</Text>
      </Box>
    );
  }

  const items = tasks.map((task: Task) => ({
    label: `#${task.id} ${task.title}`,
    value: task.id,
    key: task.id,
    task,
  }));

  return (
    <Box flexDirection="column">
      <Header
        title={listTitle}
        subtitle={`${t("tasks.total")}: ${data?.total || tasks.length} ${t("tasks.tasks")} | ${t("app.press_r")} | ${t("app.press_esc")}`}
      />
      <SelectInput
        items={items}
        onSelect={(item: any) => onSelect(item.value)}
        limit={10}
        itemComponent={({ isSelected, label }: any) => {
          const task = items.find((i) => i.label === label)?.task;
          return (
            <Box>
              <Text color={isSelected ? "cyan" : undefined} bold={isSelected}>
                {isSelected ? "> " : "  "}
              </Text>
              {task && <StatusBadge status={task.status} />}
              {task && <Text> </Text>}
              {task && <PriorityBadge priority={task.priority} />}
              <Text color={isSelected ? "cyan" : "white"}> #{task?.id} </Text>
              <Text color={isSelected ? "white" : "gray"}>
                {task?.title?.substring(0, 50)}
              </Text>
            </Box>
          );
        }}
      />
    </Box>
  );
}
