import {
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { homedir } from "os";
import en from "./locales/en.js";
import uz from "./locales/uz.js";
import ru from "./locales/ru.js";
import config from "../utils/config.js";

export type TranslationKey = keyof typeof en;
export type Translations = Record<TranslationKey, string>;

const CUSTOM_LOCALES_DIR = join(homedir(), ".config", "b24-cli", "locales");

const builtInLocales: Record<string, Translations> = { en, uz, ru };
const customLocales: Record<string, Translations> = {};

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  uz: "O'zbek tili",
  ru: "Русский",
};

function loadCustomLocales(): void {
  if (!existsSync(CUSTOM_LOCALES_DIR)) return;

  try {
    const files = readdirSync(CUSTOM_LOCALES_DIR).filter((f) =>
      f.endsWith(".json"),
    );
    for (const file of files) {
      const langCode = file.replace(".json", "");
      const filePath = join(CUSTOM_LOCALES_DIR, file);
      try {
        const content = JSON.parse(readFileSync(filePath, "utf-8"));
        customLocales[langCode] = content;
        if (content._name) {
          LANGUAGE_NAMES[langCode] = content._name;
        } else {
          LANGUAGE_NAMES[langCode] = langCode.toUpperCase();
        }
      } catch {
        // Skip invalid JSON files
      }
    }
  } catch {
    // Directory read error — skip
  }
}

function ensureCustomLocalesDir(): void {
  if (!existsSync(CUSTOM_LOCALES_DIR)) {
    mkdirSync(CUSTOM_LOCALES_DIR, { recursive: true });
  }
}

export function createTemplateLocale(): string {
  ensureCustomLocalesDir();
  const templatePath = join(CUSTOM_LOCALES_DIR, "template.json");
  if (!existsSync(templatePath)) {
    const template: Record<string, string> = { _name: "Language Name" };
    for (const key of Object.keys(en)) {
      template[key] = (en as any)[key];
    }
    writeFileSync(templatePath, JSON.stringify(template, null, 2), "utf-8");
  }
  return templatePath;
}

// Load custom locales on import
loadCustomLocales();

export function getLocale(): string {
  return config.get("locale") || "en";
}

export function setLocale(locale: string): void {
  config.set("locale" as any, locale);
}

export function getAvailableLocales(): string[] {
  return [
    ...new Set([...Object.keys(builtInLocales), ...Object.keys(customLocales)]),
  ];
}

export function t(key: TranslationKey, ...args: string[]): string {
  const locale = getLocale();
  const translations = customLocales[locale] || builtInLocales[locale] || en;
  let text = translations[key] || en[key] || key;

  // Simple interpolation: {0}, {1}, etc.
  args.forEach((arg, i) => {
    text = text.replace(`{${i}}`, arg);
  });

  return text;
}

// Status/priority maps using i18n
export function getStatusLabel(status: string): string {
  const map: Record<string, TranslationKey> = {
    "1": "status.new",
    "2": "status.pending",
    "3": "status.in_progress",
    "4": "status.awaiting_control",
    "5": "status.completed",
    "6": "status.deferred",
  };
  return map[status] ? t(map[status]) : status;
}

export function getPriorityLabel(priority: string): string {
  const map: Record<string, TranslationKey> = {
    "0": "priority.low",
    "1": "priority.medium",
    "2": "priority.high",
  };
  return map[priority] ? t(map[priority]) : priority;
}
