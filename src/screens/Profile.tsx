import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { getCurrentUser } from "../api/users.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { Header } from "../components/Header.js";
import { Loading } from "../components/Loading.js";
import { useAsync } from "../hooks/useAsync.js";
import { t } from "../i18n/index.js";

interface ProfileProps {
  onEdit: () => void;
  onBack: () => void;
}

export function Profile({ onEdit, onBack }: ProfileProps) {
  const { data: user, loading, error, refetch } = useAsync(
    () => getCurrentUser(),
    [],
  );

  useInput((input: string, key: any) => {
    if (key.escape) onBack();
    if (input === "r") refetch();
  });

  if (loading) return <Loading message={t("profile.loading")} />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  const actions = [
    { label: t("profile.edit"), value: "edit" },
    { label: t("app.back"), value: "back" },
  ];

  const handleSelect = (item: { value: string }) => {
    if (item.value === "edit") onEdit();
    else onBack();
  };

  return (
    <Box flexDirection="column">
      <Header
        title={t("profile.title")}
        subtitle={`${t("app.press_r")} | ${t("app.press_esc")}`}
      />
      <Box flexDirection="column" paddingX={1} marginBottom={1}>
        <Text>
          <Text dimColor>ID:           </Text>
          <Text bold>#{user.ID}</Text>
        </Text>
        <Text>
          <Text dimColor>{t("profile.name")}:     </Text>
          <Text>{`${user.NAME ?? ""} ${user.SECOND_NAME ?? ""} ${user.LAST_NAME ?? ""}`.trim()}</Text>
        </Text>
        <Text>
          <Text dimColor>{t("profile.email")}:       </Text>
          <Text>{user.EMAIL || "—"}</Text>
        </Text>
        {user.WORK_POSITION && (
          <Text>
            <Text dimColor>{t("profile.position")}:    </Text>
            <Text>{user.WORK_POSITION}</Text>
          </Text>
        )}
        {user.WORK_COMPANY && (
          <Text>
            <Text dimColor>{t("profile.company")}:     </Text>
            <Text>{user.WORK_COMPANY}</Text>
          </Text>
        )}
        {user.PERSONAL_PHONE && (
          <Text>
            <Text dimColor>{t("profile.phone")}:       </Text>
            <Text>{user.PERSONAL_PHONE}</Text>
          </Text>
        )}
        {user.PERSONAL_MOBILE && (
          <Text>
            <Text dimColor>{t("profile.mobile")}:      </Text>
            <Text>{user.PERSONAL_MOBILE}</Text>
          </Text>
        )}
        {user.WORK_PHONE && (
          <Text>
            <Text dimColor>{t("profile.work_phone")}: </Text>
            <Text>{user.WORK_PHONE}</Text>
          </Text>
        )}
        {user.PERSONAL_BIRTHDAY && (
          <Text>
            <Text dimColor>{t("profile.birthday")}:    </Text>
            <Text>{user.PERSONAL_BIRTHDAY.split("T")[0]}</Text>
          </Text>
        )}
        {user.UF_SKYPE && (
          <Text>
            <Text dimColor>{t("profile.skype")}:       </Text>
            <Text>{user.UF_SKYPE}</Text>
          </Text>
        )}
        {user.UF_PHONE_INNER && (
          <Text>
            <Text dimColor>{t("profile.inner_phone")}: </Text>
            <Text>{user.UF_PHONE_INNER}</Text>
          </Text>
        )}
        <Text>
          <Text dimColor>{t("profile.online")}:      </Text>
          <Text color={user.IS_ONLINE === "Y" ? "green" : "gray"}>
            {user.IS_ONLINE === "Y" ? "●  Online" : "○  Offline"}
          </Text>
        </Text>
        {user.LAST_LOGIN && (
          <Text>
            <Text dimColor>{t("profile.last_login")}:  </Text>
            <Text dimColor>{new Date(user.LAST_LOGIN).toLocaleString()}</Text>
          </Text>
        )}
      </Box>
      <SelectInput items={actions} onSelect={handleSelect} />
    </Box>
  );
}
