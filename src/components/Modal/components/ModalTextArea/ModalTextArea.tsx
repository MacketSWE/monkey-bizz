import styles from "./ModalTextArea.module.css";

interface Props {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ModalTextArea = ({ label, value, onChange }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <textarea className={styles.textarea} value={value} onChange={onChange} />
    </div>
  );
};
