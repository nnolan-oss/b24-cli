import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { updateTask, type Task } from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { t } from "../i18n/index.js";

interface EditTaskProps {
  task: Task;
  onDone: () => void;
  onBack: () => void;
}

export function EditTask({ task, onDone, onBack }: EditTaskProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [activeField, setActiveField] = useState<"title" | "desc">("title");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useInput((_input, key) => {
    if (key.escape) onBack();
    if (key.upArrow) setActiveField("title");
    if (key.downArrow) setActiveField("desc");
    if (key.return) {
      if (title) {
        handleUpdate();
      }
    }
  });

  const handleUpdate = async () => {
    setProcessing(true);
    setError(null);
    try {
      await updateTask(task.id, {
        TITLE: title,
        DESCRIPTION: description,
      });
      onDone();
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (processing) return <Loading message={t("task.updating")} />;

  return (
    <Box flexDirection="column">
      <Header title={t("task.edit_title")} subtitle={t("app.press_esc")} />
      {error && <ErrorMessage message={error} />}

      <Box flexDirection="column" paddingX={1}>
        <Text bold={activeField === "title"}>{t("task.title")}:</Text>
        <TextInput
          value={title}
          onChange={setTitle}
          focus={activeField === "title"}
        />

        <Box marginTop={1}>
          <Text bold={activeField === "desc"}>{t("task.description")}:</Text>
        </Box>
        <TextInput
          value={description}
          onChange={setDescription}
          focus={activeField === "desc"}
        />
      </Box>
    </Box>
  );
}
