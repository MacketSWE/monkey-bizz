import React from "react";
import styles from "./Drawer.module.css";
import useGlobalState from "../../store/useGlobalState";

export const Drawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen, messages } = useGlobalState();

  return (
    <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}>
      <button
        className={styles.closeButton}
        onClick={() => setIsDrawerOpen(false)}
      >
        Close Drawer
      </button>
      <DrawerContent />
    </div>
  );
};

export const DrawerContent: React.FC = () => {
  const { messages } = useGlobalState();

  return (
    <div className={styles.drawerContent}>
      <h2>Message History</h2>
      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li key={message.id} className={styles.messageItem}>
            <span className={styles.messageText}>{message.text}</span>
            <span className={styles.messageTime}>
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
