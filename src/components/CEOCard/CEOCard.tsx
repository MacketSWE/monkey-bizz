import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./CEOCard.module.css";
import { useCardState } from "../../store/useCardState";
import useGlobalState from "../../store/useGlobalState";

const CEOCard: React.FC = () => {
  const { ceo } = useCardState();
  const { setIsModalOpen, setModalContent } = useGlobalState();
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
    setModalContent("Upgrade to Expert Intelligence");
    setIsModalOpen(true);
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
          <div>Intelligence:</div>
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
                  Upgrade
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
