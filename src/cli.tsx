#!/usr/bin/env node

import { Command } from "commander";
import { render } from "ink";
import React from "react";
import { resetClient } from "./api/client.js";
import {
  addComment,
  completeTask,
  createTask,
  deferTask,
  deleteTask,
  getMyTasks,
  pauseTask,
  renewTask,
  startTask,
  updateTask,
} from "./api/tasks.js";
import { getCurrentUser } from "./api/users.js";
import { App } from "./App.js";
import {
  getAvailableLocales,
  getLocale,
  LANGUAGE_NAMES,
  setLocale,
  t,
} from "./i18n/index.js";
import {
  clearConfig,
  getUserId,
  getWebhookUrl,
  isAuthenticated,
  setUserId,
  setWebhookUrl,
} from "./utils/config.js";

const program = new Command();

program
  .name("b24-cli")
  .description("B24 CLI - manage Bitrix24 from terminal")
  .version("1.0.0");

program
  .command("login <webhookUrl>")
  .description("Authenticate with webhook URL")
  .action(async (webhookUrl: string) => {
    try {
      setWebhookUrl(webhookUrl);
      resetClient();
      const user = await getCurrentUser();
      setUserId(user.ID);
      console.log(`${t("auth.success")} ${user.NAME} ${user.LAST_NAME}!`);
      console.log(`${t("auth.user_id")}: ${user.ID}`);
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      console.error(t("auth.webhook_error"));
      clearConfig();
      process.exit(1);
    }
  });

program
  .command("logout")
  .description("Clear configuration")
  .action(() => {
    clearConfig();
    resetClient();
    console.log(t("auth.logged_out"));
  });

program
  .command("status")
  .description("Show connection status")
  .action(() => {
    if (isAuthenticated()) {
      console.log(`Webhook: ${getWebhookUrl()}`);
      console.log(t("auth.status_connected"));
      console.log(
        `${t("menu.language")}: ${LANGUAGE_NAMES[getLocale()] || getLocale()}`,
      );
    } else {
      console.log(t("auth.status_disconnected"));
      console.log(t("auth.help"));
    }
  });

program
  .command("lang [code]")
  .description("Change language (en, uz, ru)")
  .action((code?: string) => {
    if (code) {
      const available = getAvailableLocales();
      if (!available.includes(code)) {
        console.error(`${t("app.error")}: Unknown language "${code}"`);
        console.log(
          `Available: ${available.map((c) => `${c} (${LANGUAGE_NAMES[c] || c})`).join(", ")}`,
        );
        process.exit(1);
      }
      setLocale(code);
      console.log(`${t("lang.changed")} ${LANGUAGE_NAMES[code] || code}`);
    } else {
      const available = getAvailableLocales();
      const current = getLocale();
      console.log(`${t("lang.select")}`);
      available.forEach((c) => {
        const marker = c === current ? " *" : "";
        console.log(`  ${c} - ${LANGUAGE_NAMES[c] || c}${marker}`);
      });
      console.log("");
      console.log(`Usage: b24-cli lang <code>`);
    }
  });

program
  .command("tasks [taskId]")
  .description("Interactive tasks panel")
  .action((taskId?: string) => {
    const args = taskId ? [taskId] : [];
    const { waitUntilExit } = render(
      React.createElement(App, { command: "tasks", args }),
    );
    waitUntilExit().then(() => process.exit(0));
  });

const createCmd = program
  .command("create")
  .description("Create resources (task, ...)");

createCmd
  .command("task")
  .description("Create a new task")
  .requiredOption("--title <title>", "Task title")
  .option("--desc <description>", "Task description")
  .option("--deadline <date>", "Deadline (YYYY-MM-DD or ISO format)")
  .option(
    "--priority <level>",
    "Priority: 0 = low, 1 = medium, 2 = high",
    "1",
  )
  .option("--group <id>", "Group / project ID")
  .option("--responsible <id>", "Responsible user ID (defaults to you)")
  .action(async (opts) => {
    if (!isAuthenticated()) {
      console.error(t("auth.not_configured"));
      process.exit(1);
    }
    try {
      const fields: Record<string, any> = {
        TITLE: opts.title,
        PRIORITY: opts.priority,
        RESPONSIBLE_ID: opts.responsible || getUserId(),
      };
      if (opts.desc) fields.DESCRIPTION = opts.desc;
      if (opts.deadline) fields.DEADLINE = opts.deadline;
      if (opts.group) fields.GROUP_ID = opts.group;

      const result = await createTask(fields);
      const taskId = result?.task?.id ?? result?.id ?? result;
      console.log(`${t("app.success")} ID: ${taskId}`);
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      process.exit(1);
    }
  });

const TASK_ACTIONS = ["start", "complete", "pause", "defer", "renew"] as const;
type TaskAction = (typeof TASK_ACTIONS)[number];

const taskActionFns: Record<TaskAction, (id: string) => Promise<void>> = {
  start: startTask,
  complete: completeTask,
  pause: pauseTask,
  defer: deferTask,
  renew: renewTask,
};

const taskCmd = program
  .command("task")
  .description("Manage tasks");

taskCmd
  .command("status <id> <action>")
  .description(`Change task status. Actions: ${TASK_ACTIONS.join(", ")}`)
  .action(async (id: string, action: string) => {
    if (!isAuthenticated()) {
      console.error(t("auth.not_configured"));
      process.exit(1);
    }
    if (!TASK_ACTIONS.includes(action as TaskAction)) {
      console.error(
        `${t("app.error")}: Unknown action "${action}". Available: ${TASK_ACTIONS.join(", ")}`,
      );
      process.exit(1);
    }
    try {
      await taskActionFns[action as TaskAction](id);
      console.log(`${t("app.success")} Task #${id} → ${action}`);
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      process.exit(1);
    }
  });

taskCmd
  .command("list")
  .description("List tasks")
  .option("--all", "Show all tasks (default: only mine)")
  .option("--limit <n>", "Max number of tasks to show", "20")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    if (!isAuthenticated()) {
      console.error(t("auth.not_configured"));
      process.exit(1);
    }
    try {
      const params: Record<string, any> = { start: 0 };
      if (!opts.all) params.userId = getUserId();

      const { tasks, total } = await getMyTasks(params);
      const limited = tasks.slice(0, parseInt(opts.limit));

      if (opts.json) {
        console.log(JSON.stringify(limited, null, 2));
        return;
      }

      console.log(`Tasks (${limited.length}/${total}):`);
      console.log("");
      for (const task of limited) {
        console.log(`  #${task.id}  ${task.title}`);
        console.log(`       Status: ${task.status}  Priority: ${task.priority}  Responsible: ${task.responsible?.name ?? task.responsibleId}`);
        console.log("");
      }
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      process.exit(1);
    }
  });

taskCmd
  .command("edit <id>")
  .description("Edit a task")
  .option("--title <title>", "New title")
  .option("--desc <description>", "New description")
  .option("--priority <level>", "Priority: 0 = low, 1 = medium, 2 = high")
  .option("--deadline <date>", "Deadline (YYYY-MM-DD or ISO format)")
  .option("--responsible <id>", "Responsible user ID")
  .action(async (id: string, opts) => {
    if (!isAuthenticated()) {
      console.error(t("auth.not_configured"));
      process.exit(1);
    }
    const fields: Record<string, any> = {};
    if (opts.title) fields.TITLE = opts.title;
    if (opts.desc) fields.DESCRIPTION = opts.desc;
    if (opts.priority !== undefined) fields.PRIORITY = opts.priority;
    if (opts.deadline) fields.DEADLINE = opts.deadline;
    if (opts.responsible) fields.RESPONSIBLE_ID = opts.responsible;

    if (Object.keys(fields).length === 0) {
      console.error(`${t("app.error")}: At least one flag required (--title, --desc, --priority, --deadline, --responsible)`);
      process.exit(1);
    }
    try {
      await updateTask(id, fields);
      console.log(`${t("app.success")} Task #${id} updated.`);
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      process.exit(1);
    }
  });

taskCmd
  .command("comment <id>")
  .description("Add a comment to a task")
  .requiredOption("--message <text>", "Comment text")
  .action(async (id: string, opts) => {
    if (!isAuthenticated()) {
      console.error(t("auth.not_configured"));
      process.exit(1);
    }
    try {
      await addComment(id, opts.message);
      console.log(`${t("app.success")} Comment added to task #${id}`);
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      process.exit(1);
    }
  });

const deleteCmd = program
  .command("delete")
  .description("Delete resources (task, ...)");

deleteCmd
  .command("task <id>")
  .description("Delete a task by ID")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (id: string, opts) => {
    if (!isAuthenticated()) {
      console.error(t("auth.not_configured"));
      process.exit(1);
    }
    if (!opts.yes) {
      const { createInterface } = await import("readline");
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      const answer = await new Promise<string>((resolve) =>
        rl.question(`Delete task #${id}? (y/N) `, resolve),
      );
      rl.close();
      if (answer.toLowerCase() !== "y") {
        console.log(t("app.cancel"));
        return;
      }
    }
    try {
      await deleteTask(id);
      console.log(`${t("app.success")} Task #${id} deleted.`);
    } catch (err: any) {
      console.error(`${t("app.error")}: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command("open")
  .description("Interactive main menu")
  .action(() => {
    const { waitUntilExit } = render(React.createElement(App, {}));
    waitUntilExit().then(() => process.exit(0));
  });

// Default: open interactive menu or show help
if (process.argv.length <= 2) {
  if (!isAuthenticated()) {
    console.log(t("welcome.title"));
    console.log("");
    console.log(t("welcome.setup"));
    console.log(
      "  b24-cli login https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK_KEY/",
    );
    console.log("");
    console.log(t("welcome.commands"));
    console.log(`  login <url>    - ${t("welcome.login_desc")}`);
    console.log(`  tasks          - ${t("welcome.tasks_desc")}`);
    console.log(`  tasks <id>     - ${t("welcome.task_id_desc")}`);
    console.log(`  open           - ${t("welcome.open_desc")}`);
    console.log(`  status         - ${t("welcome.status_desc")}`);
    console.log(`  lang <code>    - ${t("welcome.lang_desc")}`);
    console.log(`  logout         - ${t("welcome.logout_desc")}`);
  } else {
    const { waitUntilExit } = render(React.createElement(App, {}));
    waitUntilExit().then(() => process.exit(0));
  }
} else {
  program.parse();
}
