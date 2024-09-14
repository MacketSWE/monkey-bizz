import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import { Drawer } from "../Drawer/Drawer";
import ChatInput from "../ChatInput/ChatInput";
import Modal from "../Modal/Modal";
import CEOCard from "../CEOCard/CEOCard";
import RoleCard from "../RoleCard/RoleCard";

import useGlobalState from "../../store/useGlobalState";

import { AboutSection } from "../AboutSection/AboutSection";
import { BusinessInfo } from "../BusinessInfo/BusinessInfo";

const MainPage: React.FC = () => {
  const { isDrawerOpen, toggleDrawer, setModalType, roles } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setModalType("messageHistory");
    } else {
      toggleDrawer();
    }
  };

  return (
    <div
      className={`${styles.appContainer} ${
        isDrawerOpen && !isMobile ? styles.drawerOpen : ""
      }`}
    >
      {/* Use AboutLinkContainer */}
      <AboutSection />
      {!isMobile && <Drawer />}
      <div className={styles.mainContent}>
        {!isDrawerOpen && (
          <button
            className={`${styles.button} ${styles.toggleButton}`}
            onClick={handleDrawerToggle}
          >
            {isMobile ? "History" : isDrawerOpen ? "Close Drawer" : "History"}
          </button>
        )}

        <div className={styles.contentWrapper}>
          <h1 className={styles.header}>Monkey Bizz</h1>
          <BusinessInfo />
          <CEOCard />
          <div className={styles.roleCardsContainer}>
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </div>
        <ChatInput />
      </div>
      <Modal />
    </div>
  );
};

export default MainPage;
