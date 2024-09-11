import React from "react";
import styles from "./RoleCard.module.css";
import { Role } from "../../types/role";
import { useCardState } from "../../store/useCardState";

interface RoleCardProps {
  role: Role;
}

const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const { cards } = useCardState();
  const isLoading = cards[role.id]?.isLoading;
  const content = cards[role.id]?.content;

  return (
    <div className={`${styles.roleCard} ${isLoading ? styles.loading : ""}`}>
      <h3 className={styles.title}>{role.title}</h3>
      <p className={styles.description}>{content || "Ask me something"}</p>
      {isLoading && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};

export default RoleCard;
