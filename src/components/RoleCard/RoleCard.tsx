import React from "react";
import styles from "./RoleCard.module.css";

interface RoleCardProps {
  title: string;
  description: string;
  isLoading: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  isLoading,
}) => {
  return (
    <div className={`${styles.roleCard} ${isLoading ? styles.loading : ""}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {isLoading && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};

export default RoleCard;
