import React from "react";
import styles from "./Modal.module.css";
import useGlobalState from "../../store/useGlobalState";

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { isModalOpen, setIsModalOpen } = useGlobalState();

  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.scrollableContent}>{children}</div>
        <button
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
