import { useState, useEffect } from "react";
import {
  getSprintList,
  getScrumKanbanStages,
  getStages,
  type Task,
  type Stage,
  type Sprint,
} from "../api/tasks.js";

export function useStagesMap(tasks: Task[] | undefined) {
  const [stagesMap, setStagesMap] = useState<Record<string, Stage>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStages() {
      if (!tasks || tasks.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const groupIds = [
        ...new Set(tasks.map((t) => t.groupId).filter(Boolean)),
      ];
      const allStages: Record<string, Stage> = {};

      await Promise.all(
        groupIds.map(async (groupId) => {
          try {
            const sprints = await getSprintList(groupId);
            const activeSprint = sprints.find(
              (s: Sprint) => s.status === "active",
            );

            if (activeSprint) {
              const scrumStages: any[] = await getScrumKanbanStages(
                activeSprint.id,
              );
              scrumStages.forEach((stage) => {
                allStages[stage.id] = {
                  ID: String(stage.id),
                  TITLE: stage.name,
                  SORT: String(stage.sort),
                  COLOR: stage.color,
                  ENTITY_ID: activeSprint.id,
                };
              });
            } else {
              const regularStages = await getStages(groupId);
              Object.assign(allStages, regularStages);
            }
          } catch (error) {
            // Ignore errors for individual group stages
          }
        }),
      );

      setStagesMap(allStages);
      setIsLoading(false);
    }

    fetchStages();
  }, [tasks]);

  return { stagesMap, isLoading };
}
