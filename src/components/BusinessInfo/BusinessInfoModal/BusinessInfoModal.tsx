import React, { useState, useEffect } from "react";
import styles from "./BusinessInfoModal.module.css";
import useGlobalState from "../../../store/useGlobalState";

interface BusinessInfoModalProps {
  onClose: () => void;
}

export const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({
  onClose,
}) => {
  const { businessInfo, setBusinessInfo, resetBusinessInfo } = useGlobalState();
  const [editedInfo, setEditedInfo] = useState(businessInfo);

  useEffect(() => {
    setEditedInfo(businessInfo);
  }, [businessInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessInfo(editedInfo);
    onClose();
  };

  const handleReset = () => {
    resetBusinessInfo();
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
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
