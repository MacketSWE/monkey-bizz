import React, { ReactNode } from "react";
import styles from "./Modal.module.css";
import useGlobalState from "../../store/useGlobalState";

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { modalType, setModalType } = useGlobalState();

  if (!modalType) return null; // Modal is not open

  const handleClose = () => {
    setModalType(null);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Add the close button */}
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
