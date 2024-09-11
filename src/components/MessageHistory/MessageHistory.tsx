import React from "react";
import styles from "./MessageHistory.module.css";
import useGlobalState from "../../store/useGlobalState";

const MessageHistory: React.FC = () => {
  const { messages } = useGlobalState();

  console.log(messages, "<--- bbb messages");

  return (
    <div className={styles.messageHistory}>
      <h2 className={styles.messageHistoryTitle}>Message History</h2>
      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li key={message.id} className={styles.messageItem}>
            <span className={styles.messageText}>{message.question}</span>
            <span className={styles.messageTime}>
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageHistory;
