import React from "react";
import styles from "./Drawer.module.css";
import useGlobalState from "../../store/useGlobalState";
import MessageHistory from "../MessageHistory/MessageHistory";

export const Drawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useGlobalState();

  return (
    <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}>
      <button
        className={styles.closeButton}
        onClick={() => setIsDrawerOpen(false)}
      >
        Close Drawer
      </button>
      <MessageHistory />
    </div>
  );
};
