import React from "react";
import styles from "./Modal.module.css";
import useGlobalState from "../../store/useGlobalState";
import MessageHistory from "../MessageHistory/MessageHistory";
import { BusinessInfoModal } from "../BusinessInfo/BusinessInfoModal/BusinessInfoModal";
import ReactMarkdown from "react-markdown";
import { useCardState } from "../../store/useCardState";

const Modal: React.FC = () => {
  const {
    modalType,
    setModalType,
    setBusinessInfo,
    businessInfo,
    selectedRole,
  } = useGlobalState();

  const { cards } = useCardState();

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
      </div>
    </div>
  );
};

export default Modal;
