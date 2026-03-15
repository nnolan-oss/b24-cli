import { Box, Text, useInput } from "ink";
import { getTaskHistory, type HistoryItem, type Task } from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";

interface ViewHistoryProps {
  task: Task;
  onBack: () => void;
}

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "<empty>";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getFieldName = (field: string) => {
  return field
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const renderChange = (item: HistoryItem) => {
  const from = formatValue(item.value.from);
  const to = formatValue(item.value.to);

  switch (item.field) {
    case "CHECKLIST_ITEM_CREATE":
      return (
        <Text>
          {" "}
          {">"} {to}
        </Text>
      );
    case "CHECKLIST_ITEM_REMOVE":
      return (
        <Text>
          {" "}
          {from} {">"}
        </Text>
      );
    default:
      return (
        <Text>
          <Text color="red">"{from}"</Text>
          <Text> → </Text>
          <Text color="green">"{to}"</Text>
        </Text>
      );
  }
};

export function ViewHistory({ task, onBack }: ViewHistoryProps) {
  const {
    data: history,
    loading,
    error,
    refetch,
  } = useAsync(() => getTaskHistory(task.id), [task.id]);

  useInput((input: string, key: any) => {
    if (key.escape) onBack();
    if (input === "r") refetch();
  });

  if (loading) return <Loading message={t("history.loading")} />;
  if (error) return <ErrorMessage message={error} />;

  // Create a reversed copy for display
  const list = history ? [...history].reverse() : [];

  return (
    <Box flexDirection="column">
      <Header
        title={`${t("history.title")} - #${task.id}`}
        subtitle={`${t("app.press_r")} | ${t("app.press_esc")}`}
      />
      {list.length === 0 ? (
        <Text dimColor>{t("history.empty")}</Text>
      ) : (
        list.map((item: HistoryItem) => (
          <Box key={item.id} flexDirection="column" marginBottom={1}>
            <Text>
              <Text dimColor>
                {new Date(item.createdDate).toLocaleString()} -{" "}
                {item.user?.name || `User #${item.user?.id}`}
              </Text>
              <Text> changed </Text>
              <Text bold color="yellow">
                {getFieldName(item.field)}
              </Text>
            </Text>
            <Box paddingLeft={2}>{renderChange(item)}</Box>
          </Box>
        ))
      )}
    </Box>
  );
}
