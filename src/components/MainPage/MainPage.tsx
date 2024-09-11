import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import { Drawer } from "../Drawer/Drawer";
import ChatInput from "../ChatInput/ChatInput";
import Modal from "../Modal/Modal";
import CEOCard from "../CEOCard/CEOCard";
import RoleCard from "../RoleCard/RoleCard";
import useGlobalState from "../../store/useGlobalState";
import MessageHistory from "../MessageHistory/MessageHistory";

const MainPage: React.FC = () => {
  const { isDrawerOpen, toggleDrawer, setIsModalOpen, isModalOpen, roles } =
    useGlobalState();
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
        <div className={styles.contentWrapper}>
          <h1 className={styles.header}>Monkey Bizz</h1>
          <CEOCard />
          <div className={styles.roleCardsContainer}>
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </div>
        <ChatInput />
      </div>
      <Modal>
        {isMobile && isModalOpen ? (
          <MessageHistory />
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
