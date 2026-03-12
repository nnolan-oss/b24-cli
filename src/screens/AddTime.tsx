import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useState } from "react";
import { addElapsedTime, type Task } from "../api/tasks.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { t } from "../i18n/index.js";

interface AddTimeProps {
  task: Task;
  onDone: () => void;
  onBack: () => void;
}

type Step = "hours" | "minutes" | "comment" | "confirm";

export function AddTime({ task, onDone, onBack }: AddTimeProps) {
  const [step, setStep] = useState<Step>("hours");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useInput((_input: string, key: any) => {
    if (key.escape && !processing) onBack();
    if (success && key.return) onDone();
  });

  const handleSubmit = async () => {
    const totalSeconds =
      (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60;
    if (totalSeconds <= 0) {
      setError(t("time.zero_error"));
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      await addElapsedTime(task.id, totalSeconds, comment);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (processing && !success) return <Loading message={t("time.adding")} />;

  if (success) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>
          {t("time.added")} ({hours}
          {t("task.hours")} {minutes}
          {t("task.minutes")})
        </Text>
        <Text dimColor>{t("app.press_enter")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header
        title={`${t("time.add_title")} - #${task.id}`}
        subtitle={t("app.press_esc")}
      />
      {error && <ErrorMessage message={error} />}

      {step === "hours" && (
        <Box>
          <Text color="cyan">{t("time.hours")}: </Text>
          <TextInput
            value={hours}
            onChange={setHours}
            onSubmit={() => setStep("minutes")}
            placeholder="0"
          />
        </Box>
      )}

      {step === "minutes" && (
        <Box flexDirection="column">
          <Text dimColor>
            {t("time.hours")}: {hours}
          </Text>
          <Box>
            <Text color="cyan">{t("time.minutes")}: </Text>
            <TextInput
              value={minutes}
              onChange={setMinutes}
              onSubmit={() => setStep("comment")}
              placeholder="0"
            />
          </Box>
        </Box>
      )}

      {step === "comment" && (
        <Box flexDirection="column">
          <Text dimColor>
            {t("time.hours")}: {hours} | {t("time.minutes")}: {minutes}
          </Text>
          <Box>
            <Text color="cyan">{t("time.comment")}: </Text>
            <TextInput
              value={comment}
              onChange={setComment}
              onSubmit={() => handleSubmit()}
              placeholder={t("time.comment_placeholder")}
            />
          </Box>
          <Text dimColor>{t("time.press_enter")}</Text>
        </Box>
      )}
    </Box>
  );
}
