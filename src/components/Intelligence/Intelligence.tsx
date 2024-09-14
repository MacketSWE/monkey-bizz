import React, { useState } from "react";
import styles from "./Intelligence.module.css";
import useGlobalState from "../../store/useGlobalState";

interface IntelligenceProps {
  selectedIntelligence: string;
  setSelectedIntelligence: (value: string) => void;
}

const Intelligence: React.FC<IntelligenceProps> = ({
  selectedIntelligence,
  setSelectedIntelligence,
}) => {
  const { setModalType } = useGlobalState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            <div className={styles.upgradeLink} onClick={handleUpgradeClick}>
              Tell me more!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intelligence;
