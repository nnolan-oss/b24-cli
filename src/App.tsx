import { Box, Text, useApp } from "ink";
import { useEffect, useState } from "react";
import { resetClient } from "./api/client.js";
import type { Task } from "./api/tasks.js";
import { getCurrentUser } from "./api/users.js";
import { ErrorMessage } from "./components/ErrorMessage.js";
import { Loading } from "./components/Loading.js";
import { t } from "./i18n/index.js";
import { AddComment } from "./screens/AddComment.js";
import { AddTime } from "./screens/AddTime.js";
import { ChangeLanguage } from "./screens/ChangeLanguage.js";
import { ChangeStatus } from "./screens/ChangeStatus.js";
import { DelegateTask } from "./screens/DelegateTask.js";
import { MainMenu } from "./screens/MainMenu.js";
import { MoveTask } from "./screens/MoveTask.js";
import { TaskDetail } from "./screens/TaskDetail.js";
import { TaskList } from "./screens/TaskList.js";
import { ViewComments } from "./screens/ViewComments.js";
import {
  clearConfig,
  isAuthenticated,
  setUserId,
  setWebhookUrl,
} from "./utils/config.js";

type Screen =
  | "menu"
  | "my-tasks"
  | "all-tasks"
  | "task-detail"
  | "change-status"
  | "add-comment"
  | "view-comments"
  | "add-time"
  | "delegate"
  | "move-task"
  | "language";

interface AppProps {
  command?: string;
  args?: string[];
  webhookUrl?: string;
}

export function App({ command, args, webhookUrl }: AppProps) {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (webhookUrl) {
        setWebhookUrl(webhookUrl);
        resetClient();
      }

      if (!isAuthenticated()) {
        setError(t("auth.not_configured"));
        setInitializing(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        setUserId(user.ID);
      } catch (err: any) {
        setError(`${t("auth.connection_error")}: ${err.message}`);
        setInitializing(false);
        return;
      }

      if (command === "tasks" && args && args[0]) {
        setSelectedTaskId(args[0]);
        setScreen("task-detail");
      } else if (command === "tasks") {
        setScreen("my-tasks");
      }

      setInitializing(false);
    }
    init();
  }, []);

  if (initializing) return <Loading message={t("auth.connecting")} />;
  if (error) {
    return (
      <Box flexDirection="column">
        <ErrorMessage message={error} />
        <Text dimColor>{t("auth.help")}</Text>
      </Box>
    );
  }

  const goBack = () => {
    if (
      [
        "change-status",
        "add-comment",
        "view-comments",
        "add-time",
        "delegate",
        "move-task",
      ].includes(screen)
    ) {
      setScreen("task-detail");
    } else if (screen === "task-detail") {
      setScreen("my-tasks");
    } else {
      setScreen("menu");
    }
  };

  switch (screen) {
    case "menu":
      return (
        <MainMenu
          onNavigate={(target) => {
            if (target === "exit") {
              exit();
              return;
            }
            if (target === "logout") {
              clearConfig();
              resetClient();
              exit();
              return;
            }
            setScreen(target as Screen);
          }}
        />
      );

    case "language":
      return (
        <ChangeLanguage
          onDone={() => setScreen("menu")}
          onBack={() => setScreen("menu")}
        />
      );

    case "my-tasks":
      return (
        <TaskList
          title={t("tasks.title")}
          onSelect={(id) => {
            setSelectedTaskId(id);
            setScreen("task-detail");
          }}
          onBack={() => setScreen("menu")}
        />
      );

    case "all-tasks":
      return (
        <TaskList
          title={t("tasks.all_title")}
          filter={{ RESPONSIBLE_ID: undefined }}
          onSelect={(id) => {
            setSelectedTaskId(id);
            setScreen("task-detail");
          }}
          onBack={() => setScreen("menu")}
        />
      );

    case "task-detail":
      return (
        <TaskDetail
          taskId={selectedTaskId}
          onAction={(action, task) => {
            setCurrentTask(task);
            if (action === "back") {
              goBack();
              return;
            }
            const actionMap: Record<string, Screen> = {
              status: "change-status",
              comment: "add-comment",
              comments: "view-comments",
              time: "add-time",
              delegate: "delegate",
              move: "move-task",
            };
            setScreen(actionMap[action] as Screen);
          }}
          onBack={goBack}
        />
      );

    case "move-task":
      return currentTask ? (
        <MoveTask
          task={currentTask}
          onDone={() => setScreen("task-detail")}
          onBack={() => setScreen("task-detail")}
        />
      ) : null;

    case "change-status":
      return currentTask ? (
        <ChangeStatus
          task={currentTask}
          onDone={() => setScreen("task-detail")}
          onBack={() => setScreen("task-detail")}
        />
      ) : null;

    case "add-comment":
      return currentTask ? (
        <AddComment
          task={currentTask}
          onDone={() => setScreen("task-detail")}
          onBack={() => setScreen("task-detail")}
        />
      ) : null;

    case "view-comments":
      return currentTask ? (
        <ViewComments
          task={currentTask}
          onBack={() => setScreen("task-detail")}
        />
      ) : null;

    case "add-time":
      return currentTask ? (
        <AddTime
          task={currentTask}
          onDone={() => setScreen("task-detail")}
          onBack={() => setScreen("task-detail")}
        />
      ) : null;

    case "delegate":
      return currentTask ? (
        <DelegateTask
          task={currentTask}
          onDone={() => setScreen("task-detail")}
          onBack={() => setScreen("task-detail")}
        />
      ) : null;

    default:
      return <Text>{t("app.not_found")}</Text>;
  }
}
