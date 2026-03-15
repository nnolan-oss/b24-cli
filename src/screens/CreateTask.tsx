import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { useState } from "react";
import {
  addTaskToScrumKanban,
  createTask,
  getScrumKanbanStages,
  getSprintList,
  type Sprint,
} from "../api/tasks.js";
import { getProjects, type Project } from "../api/users.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { getUserId } from "../utils/config.js";
import { t } from "../i18n/index.js";

interface CreateTaskProps {
  onDone: () => void;
  onBack: () => void;
}

export function CreateTask({ onDone, onBack }: CreateTaskProps) {
  const [step, setStep] = useState<"project" | "details">("project");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeField, setActiveField] = useState<"title" | "desc">("title");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useAsync(getProjects, []);

  useInput((_input, key) => {
    if (key.escape) onBack();
    if (step === "details") {
      if (key.upArrow) setActiveField("title");
      if (key.downArrow) setActiveField("desc");
      if (key.return && title) handleCreate();
    }
  });

  const handleCreate = async () => {
    if (!selectedProject) return;
    setProcessing(true);
    setError(null);
    try {
      const sprints = await getSprintList(selectedProject.ID);
      const activeSprint = sprints.find((s: Sprint) => s.status === "active");
      const userId = getUserId();

      const newTask = await createTask({
        TITLE: title,
        DESCRIPTION: description,
        GROUP_ID: selectedProject.ID,
        RESPONSIBLE_ID: userId,
      });

      if (activeSprint && newTask?.task?.id) {
        const stages: any[] = await getScrumKanbanStages(activeSprint.id);
        const firstStage = stages.find((s) => s.type === "NEW");
        if (firstStage) {
          await addTaskToScrumKanban(
            activeSprint.id,
            newTask.task.id,
            firstStage.id,
          );
        }
      }

      onDone();
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (projectsLoading) return <Loading message="Loading projects..." />;
  if (projectsError) return <ErrorMessage message={projectsError} />;
  if (processing) return <Loading message={t("task.creating")} />;

  if (step === "project") {
    const items = (projects || []).map((p) => ({
      label: p.NAME,
      value: p.ID,
      key: p.ID,
    }));

    return (
      <Box flexDirection="column">
        <Header title="Select Project" subtitle={t("app.press_esc")} />
        <SelectInput
          items={items}
          limit={10}
          onSelect={(item) => {
            const project = projects?.find((p) => p.ID === item.value);
            if (project) {
              setSelectedProject(project);
              setStep("details");
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header
        title={`${t("task.create_title")} in ${selectedProject?.NAME}`}
        subtitle={t("app.press_esc")}
      />
      {error && <ErrorMessage message={error} />}

      <Box flexDirection="column" paddingX={1}>
        <Text bold={activeField === "title"}>{t("task.title")}:</Text>
        <TextInput
          value={title}
          onChange={setTitle}
          focus={activeField === "title"}
          placeholder="Enter task title..."
        />

        <Box marginTop={1}>
          <Text bold={activeField === "desc"}>{t("task.description")}:</Text>
        </Box>
        <TextInput
          value={description}
          onChange={setDescription}
          focus={activeField === "desc"}
          placeholder="Enter task description (optional)..."
        />
      </Box>
    </Box>
  );
}
