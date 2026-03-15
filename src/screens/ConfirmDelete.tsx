import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { Header } from "../components/Header.js";
import { t } from "../i18n/index.js";

interface ConfirmDeleteProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDelete({ onConfirm, onCancel }: ConfirmDeleteProps) {
  const items = [
    { label: t("app.no"), value: "no" },
    { label: t("app.yes"), value: "yes" },
  ];

  const handleSelect = (item: { value: string }) => {
    if (item.value === "yes") {
      onConfirm();
    } else {
      onCancel();
    }
  };

  return (
    <Box flexDirection="column">
      <Header title={t("task.delete_confirm_title")} />
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
}
