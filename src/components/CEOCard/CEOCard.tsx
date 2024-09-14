import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./CEOCard.module.css";
import { useCardState } from "../../store/useCardState";
import useGlobalState from "../../store/useGlobalState";

const CEOCard: React.FC = () => {
  const { ceo } = useCardState();
  const { setModalType } = useGlobalState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIntelligence, setSelectedIntelligence] = useState("Default");

  const isCEOLoading = ceo.isLoading;
  const content = ceo.content;

  const handleIntelligenceChange = (value: string) => {
    if (value !== "Expert") {
      setSelectedIntelligence(value);
      setIsDropdownOpen(false);
    }
  };

  const handleUpgradeClick = () => {
    setIsDropdownOpen(false);
    setModalType("upgradeInfo");
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
        <div className={styles.intelligence}>
          <span className={styles.intelligenceLabel}>Intelligence:</span>
          <div className={styles.dropdown}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {selectedIntelligence}
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                <div onClick={() => handleIntelligenceChange("Default")}>
                  Default
                </div>
                <div className={styles.disabledOption}>Expert</div>
                <div
                  className={styles.upgradeLink}
                  onClick={handleUpgradeClick}
                >
                  Tell me more!
                </div>
              </div>
            )}
          </div>
        </div>
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
