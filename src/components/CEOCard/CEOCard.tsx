import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./CEOCard.module.css";
import { useCardState } from "../../store/useCardState";
import Intelligence from "../Intelligence/Intelligence"; // Import the new component
import { SettingsIcon } from "../../assets/SettingsIcon";
import useGlobalState from "../../store/useGlobalState";

const CEOCard: React.FC = () => {
  const { ceo } = useCardState();
  const [selectedIntelligence, setSelectedIntelligence] = useState("Default");
  const { setModalType } = useGlobalState();
  const isCEOLoading = ceo.isLoading;
  const content = ceo.content;

  const handleSettings = () => {
    setModalType("ceoSettings");
  };

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
        <Intelligence
          selectedIntelligence={selectedIntelligence}
          setSelectedIntelligence={setSelectedIntelligence}
        />
        <SettingsIcon
          className={styles.settingsIcon}
          onPress={handleSettings}
        />
        <h2 className={styles.name}>{"CEO"}</h2>
        <div className={styles.description}>
          <ReactMarkdown>{content || "How can I help?"}</ReactMarkdown>
        </div>
        {isCEOLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingIndicator}>Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CEOCard;
