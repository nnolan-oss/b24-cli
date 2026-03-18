import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useState } from "react";
import { getCurrentUser, updateUser } from "../api/users.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";
import { getUserId } from "../utils/config.js";

interface EditProfileProps {
  onDone: () => void;
  onBack: () => void;
}

type Field =
  | "name"
  | "last_name"
  | "email"
  | "position"
  | "company"
  | "phone"
  | "mobile"
  | "birthday"
  | "skype";

const FIELDS: Field[] = [
  "name",
  "last_name",
  "email",
  "position",
  "company",
  "phone",
  "mobile",
  "birthday",
  "skype",
];

export function EditProfile({ onDone, onBack }: EditProfileProps) {
  const { data: user, loading: userLoading } = useAsync(
    () => getCurrentUser(),
    [],
  );

  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    last_name: "",
    email: "",
    position: "",
    company: "",
    phone: "",
    mobile: "",
    birthday: "",
    skype: "",
  });

  const [initialized, setInitialized] = useState(false);
  const [activeField, setActiveField] = useState<Field>("name");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill values once user is loaded
  if (user && !initialized) {
    setValues({
      name: user.NAME ?? "",
      last_name: user.LAST_NAME ?? "",
      email: user.EMAIL ?? "",
      position: user.WORK_POSITION ?? "",
      company: user.WORK_COMPANY ?? "",
      phone: user.PERSONAL_PHONE ?? "",
      mobile: user.PERSONAL_MOBILE ?? "",
      birthday: user.PERSONAL_BIRTHDAY?.split("T")[0] ?? "",
      skype: user.UF_SKYPE ?? "",
    });
    setInitialized(true);
  }

  useInput((_input, key) => {
    if (key.escape && !processing) onBack();
    if (key.upArrow) {
      const idx = FIELDS.indexOf(activeField);
      if (idx > 0) setActiveField(FIELDS[idx - 1]);
    }
    if (key.downArrow) {
      const idx = FIELDS.indexOf(activeField);
      if (idx < FIELDS.length - 1) setActiveField(FIELDS[idx + 1]);
    }
    if (key.return && !processing) handleSave();
    if (success && key.return) onDone();
  });

  const handleSave = async () => {
    setProcessing(true);
    setError(null);
    try {
      const fields: Record<string, any> = {};
      if (values.name) fields.NAME = values.name;
      if (values.last_name) fields.LAST_NAME = values.last_name;
      if (values.email) fields.EMAIL = values.email;
      if (values.position) fields.WORK_POSITION = values.position;
      if (values.company) fields.WORK_COMPANY = values.company;
      if (values.phone) fields.PERSONAL_PHONE = values.phone;
      if (values.mobile) fields.PERSONAL_MOBILE = values.mobile;
      if (values.birthday) fields.PERSONAL_BIRTHDAY = values.birthday;
      if (values.skype) fields.UF_SKYPE = values.skype;

      await updateUser(getUserId(), fields);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (userLoading) return <Loading message={t("profile.loading")} />;
  if (processing) return <Loading message={t("profile.updating")} />;

  if (success) {
    return (
      <Box flexDirection="column">
        <Text color="green" bold>
          {t("profile.updated")}
        </Text>
        <Text dimColor>{t("app.press_enter")}</Text>
      </Box>
    );
  }

  const fieldLabels: Record<Field, string> = {
    name: t("profile.name"),
    last_name: t("profile.last_name"),
    email: t("profile.email"),
    position: t("profile.position"),
    company: t("profile.company"),
    phone: t("profile.phone"),
    mobile: t("profile.mobile"),
    birthday: t("profile.birthday"),
    skype: t("profile.skype"),
  };

  return (
    <Box flexDirection="column">
      <Header
        title={t("profile.edit_title")}
        subtitle={`↑↓ ${t("app.back")} | ENTER - save | ${t("app.press_esc")}`}
      />
      {error && <ErrorMessage message={error} />}
      <Box flexDirection="column" paddingX={1}>
        {FIELDS.map((field) => (
          <Box key={field} flexDirection="column" marginBottom={0}>
            <Text bold={activeField === field} color={activeField === field ? "cyan" : undefined}>
              {fieldLabels[field]}:
            </Text>
            <TextInput
              value={values[field]}
              onChange={(val) => setValues((prev) => ({ ...prev, [field]: val }))}
              focus={activeField === field}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
