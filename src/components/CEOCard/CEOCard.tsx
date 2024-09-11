import React from "react";
import styles from "./CEOCard.module.css";
import { useCardState } from "../../store/useCardState";

const CEOCard: React.FC = () => {
  const { ceo } = useCardState();
  const isCEOLoading = ceo.isLoading;
  const content = ceo.content;

  return (
    <div className={`${styles.ceoCard} ${isCEOLoading ? styles.loading : ""}`}>
      <div className={styles.avatarContainer}>
        <img
          src={
            "https://raw.githubusercontent.com/MacketSWE/honey-ginger-assets/main/monkeyceo.png"
          }
          alt={"ceo"}
          className={styles.avatar}
        />
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.name}>{"CEO"}</h2>
        <p className={styles.description}>{content || "How can I help?"}</p>
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
