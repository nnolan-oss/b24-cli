import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { getTask, type Task } from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";

type Action =
  | "status"
  | "comment"
  | "time"
  | "delegate"
  | "move"
  | "comments"
  | "back";

interface TaskDetailProps {
  taskId: string;
  onAction: (action: Action, task: Task) => void;
  onBack: () => void;
}

export function TaskDetail({ taskId, onAction, onBack }: TaskDetailProps) {
  const {
    data: task,
    loading,
    error,
  } = useAsync(() => getTask(taskId), [taskId]);

  useInput((_input: string, key: any) => {
    if (key.escape) onBack();
  });

  if (loading) return <Loading message={t("task.loading")} />;
  if (error) return <ErrorMessage message={error} />;
  if (!task) return <ErrorMessage message={t("task.not_found")} />;

  const actions = [
    { label: t("action.change_status"), value: "status" as Action },
    { label: t("action.add_comment"), value: "comment" as Action },
    { label: t("action.view_comments"), value: "comments" as Action },
    { label: t("action.add_time"), value: "time" as Action },
    { label: t("action.delegate"), value: "delegate" as Action },
    { label: t("action.move_stage"), value: "move" as Action },
    { label: t("action.back"), value: "back" as Action },
  ];

  return (
    <Box flexDirection="column">
      <Header
        title={`${t("task.detail_title")} #${task.id}`}
        subtitle={t("app.press_esc")}
      />

      <Box flexDirection="column" marginBottom={1} paddingX={1}>
        <Box>
          <Text bold color="white">
            {task.title}
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text dimColor>{t("task.status")}: </Text>
            <StatusBadge status={task.status} />
          </Box>
          <Box>
            <Text dimColor>{t("task.priority")}:</Text>
            <Text> </Text>
            <PriorityBadge priority={task.priority} />
          </Box>
          <Box>
            <Text dimColor>{t("task.responsible")}: </Text>
            <Text color="yellow">
              {task.responsible?.name || `ID: ${task.responsibleId}`}
            </Text>
          </Box>
          <Box>
            <Text dimColor>{t("task.creator")}:</Text>
            <Text> {task.creator?.name || `ID: ${task.createdBy}`}</Text>
          </Box>
          {task.groupId && task.groupId !== "0" && (
            <Box>
              <Text dimColor>{t("task.group")}: </Text>
              <Text>{task.group?.name || `ID: ${task.groupId}`}</Text>
            </Box>
          )}
          {task.deadline && (
            <Box>
              <Text dimColor>{t("task.deadline")}: </Text>
              <Text
                color={new Date(task.deadline) < new Date() ? "red" : "green"}
              >
                {new Date(task.deadline).toLocaleDateString()}
              </Text>
            </Box>
          )}
          {task.timeSpentInLogs && task.timeSpentInLogs !== "0" && (
            <Box>
              <Text dimColor>{t("task.time_spent")}: </Text>
              <Text>
                {Math.round(Number(task.timeSpentInLogs) / 3600)}{" "}
                {t("task.hours")}{" "}
                {Math.round((Number(task.timeSpentInLogs) % 3600) / 60)}{" "}
                {t("task.minutes")}
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      <Box flexDirection="column">
        <Text bold color="cyan">
          {t("task.actions")}
        </Text>
        <SelectInput
          items={actions}
          onSelect={(item: { value: Action }) => {
            if (item.value === "back") {
              onBack();
            } else {
              onAction(item.value, task);
            }
          }}
        />
      </Box>
    </Box>
  );
}
