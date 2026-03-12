#!/usr/bin/env node

import { Command } from "commander";
import { render } from "ink";
import React from "react";
import { resetClient } from "./api/client.js";
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
