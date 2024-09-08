import React from "react";
import styles from "./CEOCard.module.css";
import useGlobalState from "../../store/useGlobalState";

interface CEOCardProps {
  name: string;
  title: string;
  imageUrl: string;
  description: string;
}

const CEOCard: React.FC<CEOCardProps> = ({
  name,
  title,
  imageUrl,
  description,
}) => {
  const { isCEOLoading } = useGlobalState();

  return (
    <div className={`${styles.ceoCard} ${isCEOLoading ? styles.loading : ""}`}>
      <div className={styles.avatarContainer}>
        <img src={imageUrl} alt={name} className={styles.avatar} />
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.name}>{name}</h2>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      {isCEOLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingIndicator}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default CEOCard;
