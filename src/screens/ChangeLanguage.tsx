import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { useState } from "react";
import { Header } from "../components/Header.js";
import {
  createTemplateLocale,
  getAvailableLocales,
  getLocale,
  LANGUAGE_NAMES,
  setLocale,
  t,
} from "../i18n/index.js";

interface ChangeLanguageProps {
  onDone: () => void;
  onBack: () => void;
}

export function ChangeLanguage({ onDone, onBack }: ChangeLanguageProps) {
  const [changed, setChanged] = useState(false);
  const [selectedLang, setSelectedLang] = useState("");
  const currentLocale = getLocale();

  useInput((_input: string, key: any) => {
    if (key.escape) onBack();
    if (changed && key.return) onDone();
  });

  const locales = getAvailableLocales();
  const items = locales.map((code) => ({
    label: `${LANGUAGE_NAMES[code] || code}${code === currentLocale ? " *" : ""}`,
    value: code,
  }));

  const handleSelect = (item: { value: string }) => {
    setLocale(item.value);
    setSelectedLang(LANGUAGE_NAMES[item.value] || item.value);
    setChanged(true);
  };

  if (changed) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>
          {t("lang.changed")} {selectedLang}
        </Text>
        <Text dimColor>{t("lang.custom_hint")}</Text>
        <Text dimColor>{t("app.press_enter")}</Text>
      </Box>
    );
  }

  const templatePath = createTemplateLocale();

  return (
    <Box flexDirection="column">
      <Header title={t("lang.title")} subtitle={t("app.press_esc")} />
      <Text bold color="cyan">
        {t("lang.select")}
      </Text>
      <SelectInput items={items} onSelect={handleSelect} />
      <Box marginTop={1}>
        <Text dimColor>{t("lang.custom_hint")}</Text>
      </Box>
      <Text dimColor>Template: {templatePath}</Text>
    </Box>
  );
}
