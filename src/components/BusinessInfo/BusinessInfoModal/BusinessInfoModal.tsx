import React, { useState } from "react";
import { BusinessInfo } from "../../../types/businessInfo";
import styles from "./BusinessInfoModal.module.css";

interface BusinessInfoModalProps {
  businessInfo: BusinessInfo;
  onSave: (updatedInfo: BusinessInfo) => void;
  onClose: () => void;
}

export const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({
  businessInfo,
  onSave,
  onClose,
}) => {
  const [editedInfo, setEditedInfo] = useState(businessInfo);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedInfo);
  };

  return (
    <div className={styles.modalContent}>
      <h2>Edit Business Info</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Business Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={editedInfo.name}
          onChange={handleChange}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={editedInfo.description}
          onChange={handleChange}
          rows={4}
        />

        <div className={styles.buttonContainer}>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
