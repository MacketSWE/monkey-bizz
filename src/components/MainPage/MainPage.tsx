import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import { Drawer, DrawerContent } from "../Drawer/Drawer";
import ChatInput from "../ChatInput/ChatInput";
import Modal from "../Modal/Modal";
import CEOCard from "../CEOCard/CEOCard";
import RoleCard from "../RoleCard/RoleCard";
import useGlobalState from "../../store/useGlobalState";

const MainPage: React.FC = () => {
  const {
    isDrawerOpen,
    toggleDrawer,
    setIsModalOpen,
    isModalOpen,
    roles,
    clearMessageHistory, // Add this line
  } = useGlobalState();
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
      setIsModalOpen(true);
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
      {!isMobile && <Drawer />}
      <div className={styles.mainContent}>
        <button className={styles.toggleButton} onClick={handleDrawerToggle}>
          {isMobile
            ? "Open Menu"
            : isDrawerOpen
            ? "Close Drawer"
            : "Open Drawer"}
        </button>
        <button
          className={styles.businessInfoButton}
          onClick={() => setIsModalOpen(true)}
        >
          Business Info
        </button>
        <button
          className={styles.clearHistoryButton}
          onClick={clearMessageHistory}
        >
          Clear History
        </button>
        <div className={styles.contentWrapper}>
          <h1 className={styles.header}>Monkey Bizz</h1>
          <CEOCard
            name="John Doe"
            title="CEO & Founder"
            imageUrl="https://raw.githubusercontent.com/MacketSWE/honey-ginger-assets/main/monkeyceo.png"
            description="John Doe is the visionary leader behind Monkey Bizz, driving innovation and growth in the industry."
          />
          <div className={styles.roleCardsContainer}>
            {roles.map((role, index) => (
              <RoleCard
                key={index}
                title={role.title}
                description={role.description}
                isLoading={role.isLoading}
              />
            ))}
          </div>
        </div>
        <ChatInput />
      </div>
      <Modal>
        {isMobile && isModalOpen ? (
          <DrawerContent />
        ) : (
          <>
            <h2>This is a Modal</h2>
            <p>You can add any content here.</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MainPage;
