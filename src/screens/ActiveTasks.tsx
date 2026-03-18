import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { useEffect, useState } from "react";
import {
  getElapsedTime,
  getMyTasks,
  type Task,
} from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";
import { getUserId } from "../utils/config.js";

interface ActiveTasksProps {
  onSelect: (taskId: string) => void;
  onBack: () => void;
}

const formatTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
};

export function ActiveTasks({ onSelect, onBack }: ActiveTasksProps) {
  const userId = getUserId();
  const [timeMap, setTimeMap] = useState<Record<string, number>>({});
  const [timeLoading, setTimeLoading] = useState(false);

  const { data, loading, error, refetch } = useAsync(
    () => getMyTasks({ userId, filter: { REAL_STATUS: 3 } }),
    [userId],
  );

  const tasks: Task[] = data?.tasks ?? [];

  useEffect(() => {
    if (!tasks.length) return;
    setTimeLoading(true);
    Promise.all(
      tasks.map(async (task) => {
        const items = await getElapsedTime(task.id);
        const total = items.reduce(
          (sum, item) => sum + parseInt(item.SECONDS ?? "0"),
          0,
        );
        return [task.id, total] as [string, number];
      }),
    )
      .then((entries) => setTimeMap(Object.fromEntries(entries)))
      .finally(() => setTimeLoading(false));
  }, [tasks.map((task) => task.id).join(",")]);

  useInput((input: string, key: any) => {
    if (key.escape) onBack();
    if (input === "r") refetch();
  });

  if (loading) return <Loading message={t("active.loading")} />;
  if (error) return <ErrorMessage message={error} />;

  if (tasks.length === 0) {
    return (
      <Box flexDirection="column">
        <Header title={t("active.title")} />
        <Text dimColor>{t("active.empty")}</Text>
        <Text dimColor>{t("app.press_esc")}</Text>
      </Box>
    );
  }

  const items = [
    ...tasks.map((task) => ({
      label: `#${task.id} ${task.title}`,
      value: task.id,
      key: task.id,
      task,
    })),
    { label: t("app.back"), value: "back", key: "back", task: null as any },
  ];

  return (
    <Box flexDirection="column">
      <Header
        title={t("active.title")}
        subtitle={`${tasks.length} ${t("tasks.tasks")} | ${timeLoading ? "loading times..." : t("active.time_logged")} | ${t("app.press_r")} | ${t("app.press_esc")}`}
      />
      <SelectInput
        items={items}
        onSelect={(item: any) => {
          if (item.value === "back") onBack();
          else onSelect(item.value);
        }}
        limit={12}
        itemComponent={({ isSelected, label }: any) => {
          const found = items.find((i) => i.label === label);
          const task = found?.task;
          if (!task) {
            return (
              <Text color={isSelected ? "cyan" : "gray"}>
                {isSelected ? "> " : "  "}
                {label}
              </Text>
            );
          }
          const sec = timeMap[task.id] ?? 0;
          const deadline = task.deadline?.split("T")[0];
          const isOverdue =
            deadline && deadline < new Date().toISOString().split("T")[0];
          return (
            <Box>
              <Text color={isSelected ? "cyan" : undefined} bold={isSelected}>
                {isSelected ? "> " : "  "}
              </Text>
              <Text color={isSelected ? "white" : "gray"}>#{task.id} </Text>
              <Text color={isSelected ? "cyan" : "white"}>
                {task.title?.substring(0, 38)}
              </Text>
              {sec > 0 && (
                <Text color="yellow"> [{formatTime(sec)}]</Text>
              )}
              {deadline && (
                <Text color={isOverdue ? "red" : "gray"}>
                  {" "}
                  {deadline}
                </Text>
              )}
            </Box>
          );
        }}
      />
    </Box>
  );
}
