import React from "react";
import styles from "./AboutSection.module.css";
import useGlobalState from "../../store/useGlobalState";

export const AboutSection: React.FC = () => {
  const { setModalType } = useGlobalState();

  const handleAboutClick = () => {
    setModalType("about");
  };

  return (
    <div className={styles.aboutLinkContainer}>
      <div className={styles.aboutLinkDesktop} onClick={handleAboutClick}>
        About | Contact | Privacy
      </div>
      <button
        className={`${styles.button} ${styles.aboutButtonMobile}`}
        onClick={handleAboutClick}
      >
        About
      </button>
    </div>
  );
};
