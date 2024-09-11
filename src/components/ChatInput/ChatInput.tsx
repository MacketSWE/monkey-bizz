import React, { useState } from "react";
import styles from "./ChatInput.module.css";
import useGlobalState from "../../store/useGlobalState";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { askQuestion } = useGlobalState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
      askQuestion(message);
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
