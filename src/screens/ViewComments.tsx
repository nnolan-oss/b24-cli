import { Box, Text, useInput } from "ink";
import { getComments, type Task } from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";

interface ViewCommentsProps {
  task: Task;
  onBack: () => void;
}

export function ViewComments({ task, onBack }: ViewCommentsProps) {
  const {
    data: comments,
    loading,
    error,
    refetch,
  } = useAsync(() => getComments(task.id), [task.id]);

  useInput((input: string, key: any) => {
    if (key.escape) onBack();
    if (input === "r") refetch();
  });

  if (loading) return <Loading message={t("comments.loading")} />;
  if (error) return <ErrorMessage message={error} />;

  const list = comments || [];

  return (
    <Box flexDirection="column">
      <Header
        title={`${t("comments.title")} - #${task.id}`}
        subtitle={`${t("app.press_r")} | ${t("app.press_esc")}`}
      />
      {list.length === 0 ? (
        <Text dimColor>{t("comments.empty")}</Text>
      ) : (
        list.map((comment, i) => (
          <Box
            key={comment.ID || i}
            flexDirection="column"
            marginBottom={1}
            paddingLeft={1}
          >
            <Box>
              <Text bold color="yellow">
                {comment.AUTHOR_NAME || `User #${comment.AUTHOR_ID}`}
              </Text>
              <Text dimColor>
                {" "}
                -{" "}
                {comment.POST_DATE
                  ? new Date(comment.POST_DATE).toLocaleString()
                  : ""}
              </Text>
            </Box>
            <Text wrap="wrap">
              {(comment.POST_MESSAGE || "").replace(/<[^>]+>/g, "")}
            </Text>
          </Box>
        ))
      )}
    </Box>
  );
}
