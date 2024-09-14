import React, { useMemo } from "react";
import styles from "./RoleCard.module.css";
import useGlobalState from "../../store/useGlobalState";
import { Role } from "../../types/role"; // Import the Role interface
import { useCardState } from "../../store/useCardState"; // Import useCardState
import { getHello } from "../../helpers/getHello";
import { SettingsIcon } from "../../assets/SettingsIcon";

const RoleCard: React.FC<{ role: Role }> = ({ role }) => {
  const { setModalType, setSelectedRole } = useGlobalState();
  const { cards } = useCardState();

  const handleClick = () => {
    setSelectedRole(role);
    setModalType("roleAnswer");
  };

  const handleSettings = () => {
    setSelectedRole(role);
    setModalType("roleSettings");
  };

  const hello = useMemo(() => getHello(), []);

  // Get the content and loading state for this role
  const cardContent = cards[role.id]?.content || "";
  const isLoading = cards[role.id]?.isLoading || false;

  return (
    <div
      className={`${styles.roleCard} ${isLoading ? styles.loading : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <SettingsIcon className={styles.settingsIcon} onPress={handleSettings} />
      <h3 className={styles.title}>{role.title}</h3>
      {isLoading ? (
        <div className={styles.loadingIndicator}>Loading...</div>
      ) : (
        <p className={styles.description}>{cardContent || hello}</p>
      )}
    </div>
  );
};

export default RoleCard;
