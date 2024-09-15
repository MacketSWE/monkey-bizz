import React from "react";
import styles from "./Modal.module.css";
import useGlobalState from "../../store/useGlobalState";
import MessageHistory from "../MessageHistory/MessageHistory";
import { BusinessInfoModal } from "../BusinessInfo/BusinessInfoModal/BusinessInfoModal";
import ReactMarkdown from "react-markdown";
import { useCardState } from "../../store/useCardState";
import { ModalTextArea } from "./components/ModalTextArea/ModalTextArea";

const Modal: React.FC = () => {
  const {
    modalType,
    setModalType,
    setBusinessInfo,
    businessInfo,
    selectedRole,
    ceoRole,
    setRoles,
    setCeoRole,
    setSelectedRole,
  } = useGlobalState();

  const { cards } = useCardState();

  if (!modalType) return null; // Modal is not open

  const handleClose = () => {
    setModalType(null);
  };

  const handleRoleChange = (field: string, value: string) => {
    if (selectedRole) {
      const updatedRole = { ...selectedRole, [field]: value };
      setRoles(updatedRole);
      setSelectedRole(updatedRole);
    }
  };

  const handleCeoChange = (field: string, value: string) => {
    const updatedCeoRole = { ...ceoRole, [field]: value };
    setCeoRole(updatedCeoRole);
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
        {modalType === "roleSettings" && selectedRole && (
          <div>
            <h2>{selectedRole.title}'s Settings</h2>
            <ModalTextArea
              label="Personality"
              value={selectedRole.personality}
              onChange={(e) => handleRoleChange("personality", e.target.value)}
            />
            <ModalTextArea
              label="Description"
              value={selectedRole.description}
              onChange={(e) => handleRoleChange("description", e.target.value)}
            />
            <button onClick={() => setModalType(null)}>Reset to default</button>
            <button onClick={() => setModalType(null)}>Save</button>
          </div>
        )}
        {modalType === "ceoSettings" && (
          <div>
            <h2>CEO Settings</h2>
            <ModalTextArea
              label="Description"
              value={ceoRole.description}
              onChange={(e) => handleCeoChange("description", e.target.value)}
            />
            <ModalTextArea
              label="Personality"
              value={ceoRole.personality}
              onChange={(e) => handleCeoChange("personality", e.target.value)}
            />
            <button onClick={() => setModalType(null)}>Reset to default</button>
            <button onClick={() => setModalType(null)}>Save</button>
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
