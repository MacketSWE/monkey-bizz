import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import { Drawer } from "../Drawer/Drawer";
import ChatInput from "../ChatInput/ChatInput";
import Modal from "../Modal/Modal";
import CEOCard from "../CEOCard/CEOCard";
import RoleCard from "../RoleCard/RoleCard";
import ReactMarkdown from "react-markdown";
import useGlobalState from "../../store/useGlobalState";
import MessageHistory from "../MessageHistory/MessageHistory";
import BusinessInfoModal from "../BusinessInfoModal/BusinessInfoModal";
import { useCardState } from "../../store/useCardState";

const MainPage: React.FC = () => {
  const {
    isDrawerOpen,
    toggleDrawer,
    modalType,
    setModalType,
    roles,
    businessInfo,
    setBusinessInfo,
    selectedRole,
  } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { cards } = useCardState();

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

  const handleEditBusinessInfo = () => {
    setModalType("businessInfo");
  };

  const handleAboutClick = () => {
    setModalType("about");
  };

  return (
    <div
      className={`${styles.appContainer} ${
        isDrawerOpen && !isMobile ? styles.drawerOpen : ""
      }`}
    >
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
          <div
            className={styles.businessInfoContainer}
            onClick={handleEditBusinessInfo}
            role="button"
            tabIndex={0}
            aria-label="Edit business info"
          >
            <div className={styles.businessInfo}>{businessInfo.name}</div>
            <div className={styles.editButton}>
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
        {modalType === "messageHistory" && <MessageHistory />}
        {modalType === "businessInfo" && (
          <BusinessInfoModal
            businessInfo={businessInfo}
            onSave={(updatedInfo) => {
              setBusinessInfo(updatedInfo);
              setModalType(null);
            }}
            onClose={() => setModalType(null)}
          />
        )}
        {modalType === "roleAnswer" && selectedRole && (
          <div>
            <h2>{selectedRole.title}'s Response</h2>
            <ReactMarkdown>
              {cards[selectedRole.id]?.content || "No response available."}
            </ReactMarkdown>
          </div>
        )}
        {modalType === "upgradeInfo" && (
          <div>
            <h2>Upgrade</h2>
            <p>Upgrade upgrade</p>
          </div>
        )}
        {modalType === "about" && (
          <div>
            <h2>About Monkey Bizz</h2>
            <p>About about</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MainPage;
