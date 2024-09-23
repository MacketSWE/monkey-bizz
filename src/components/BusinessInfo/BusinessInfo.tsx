import React from "react";
import styles from "./BusinessInfo.module.css";
import useGlobalState from "../../store/useGlobalState";
import { useBusinessInfo } from "../../store/useBusinessInfo";

export const BusinessInfo: React.FC = () => {
  const { setModalType } = useGlobalState();
  const { businessInfo } = useBusinessInfo();

  const handleEditBusinessInfo = () => {
    setModalType("businessInfo");
  };

  return (
    <div
      className={styles.businessInfoContainer}
      onClick={handleEditBusinessInfo}
      role="button"
      tabIndex={0}
      aria-label="Edit business info"
    >
      <div className={styles.businessInfo}>{businessInfo.name}</div>
      <div className={styles.editButton}>
        {/* SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="lightgray"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </div>
    </div>
  );
};
