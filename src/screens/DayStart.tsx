import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { getMyTasks, type Task } from "../api/tasks.js";
import { getCurrentUser as getUser } from "../api/users.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";
import { getUserId } from "../utils/config.js";

interface DayStartProps {
  onSelect: (taskId: string) => void;
  onBack: () => void;
}

export function DayStart({ onSelect, onBack }: DayStartProps) {
  const userId = getUserId();

  const { data, loading, error, refetch } = useAsync(async () => {
    const today = new Date().toISOString().split("T")[0];
    const [user, activeRes, overdueRes] = await Promise.all([
      getUser(),
      getMyTasks({ userId, filter: { REAL_STATUS: 3 } }),
      getMyTasks({
        userId,
        filter: { "<DEADLINE": today, "!STATUS": "5" },
      }),
    ]);
    const activeIds = new Set(activeRes.tasks.map((t) => t.id));
    const overdue = overdueRes.tasks.filter(
      (task) => !activeIds.has(task.id),
    );
    return { user, active: activeRes.tasks, overdue };
  }, [userId]);

  useInput((input: string, key: any) => {
    if (key.escape) onBack();
    if (input === "r") refetch();
  });

  if (loading) return <Loading message={t("day.loading")} />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const { user, active, overdue } = data;
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("day.greeting_morning")
      : hour < 17
        ? t("day.greeting_afternoon")
        : t("day.greeting_evening");

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const buildItems = () => {
    const items: Array<{ label: string; value: string; key: string }> = [];

    // Active section header
    items.push({
      label: `── ${t("day.active_section")} (${active.length}) ──`,
      value: "section:active",
      key: "section:active",
    });
    if (active.length === 0) {
      items.push({ label: `  ${t("day.none")}`, value: "section:none1", key: "section:none1" });
    } else {
      active.forEach((task: Task) => {
        items.push({
          label: `  #${task.id} ${task.title?.substring(0, 45)}`,
          value: `task:${task.id}`,
          key: `task:${task.id}`,
        });
      });
    }

    // Overdue section header
    items.push({
      label: `── ${t("day.overdue_section")} (${overdue.length}) ──`,
      value: "section:overdue",
      key: "section:overdue",
    });
    if (overdue.length === 0) {
      items.push({ label: `  ${t("day.none")}`, value: "section:none2", key: "section:none2" });
    } else {
      overdue.forEach((task: Task) => {
        const due = task.deadline?.split("T")[0] ?? "";
        items.push({
          label: `  #${task.id} ${task.title?.substring(0, 38)} (${due})`,
          value: `task:${task.id}`,
          key: `task-o:${task.id}`,
        });
      });
    }

    items.push({ label: t("app.back"), value: "back", key: "back" });
    return items;
  };

  const items = buildItems();

  const handleSelect = (item: { value: string }) => {
    if (item.value.startsWith("section:")) return;
    if (item.value === "back") {
      onBack();
      return;
    }
    if (item.value.startsWith("task:")) {
      onSelect(item.value.replace("task:", ""));
    }
  };

  return (
    <Box flexDirection="column">
      <Header
        title={t("day.title")}
        subtitle={`${t("app.press_r")} | ${t("app.press_esc")}`}
      />
      <Box paddingX={1} marginBottom={1} flexDirection="column">
        <Text bold color="cyan">
          {greeting}, {user.NAME}!
        </Text>
        <Text dimColor>{today}</Text>
      </Box>
      <SelectInput
        items={items}
        onSelect={handleSelect}
        limit={15}
        itemComponent={({ isSelected, label }: any) => {
          const item = items.find((i) => i.label === label);
          const isSection =
            item?.value.startsWith("section:") ?? false;
          const isOverdueTask =
            !isSection &&
            item?.value.startsWith("task:") &&
            label.includes("(20");
          return (
            <Text
              color={
                isSection
                  ? "yellow"
                  : isSelected
                    ? "cyan"
                    : isOverdueTask
                      ? "red"
                      : "white"
              }
              bold={isSection || isSelected}
              dimColor={isSection}
            >
              {!isSection && (isSelected ? ">" : " ")}
              {label}
            </Text>
          );
        }}
      />
    </Box>
  );
}
