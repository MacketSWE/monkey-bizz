import React from "react";
import styles from "./MessageHistory.module.css";
import useGlobalState from "../../store/useGlobalState";
import { Message } from "../../types/message";
import { useCardState } from "../../store/useCardState";

const MessageHistory: React.FC = () => {
  const { messages, clearMessageHistory, deleteMessage } = useGlobalState();
  const { setCeo, setCards } = useCardState();

  const handleMessageClick = (message: Message) => {
    setCeo({
      content: message.ceoAnswer?.text || "",
      isLoading: false,
    });
    const roleAnswersMap = Object.fromEntries(
      Object.entries(message.roleAnsers).map(([key, value]) => [
        key,
        {
          content: value.text,
          isLoading: false,
        },
      ])
    );
    setCards(roleAnswersMap);
  };

  const handleDeleteMessage = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation(); // Prevent triggering handleMessageClick
    deleteMessage(id);
  };

  const handleClearHistory = () => {
    clearMessageHistory();
  };

  return (
    <div className={styles.messageHistory}>
      <h2 className={styles.messageHistoryTitle}>Message History</h2>

      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li
            key={message.id}
            className={styles.messageItem}
            onClick={() => handleMessageClick(message)}
          >
            <span className={styles.messageText}>{message.question}</span>
            <span className={styles.messageTime}>
              {new Date(message.timestamp).toLocaleString()}
            </span>
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDeleteMessage(e, message.id)}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      {messages.length > 0 && (
        <button onClick={handleClearHistory} className={styles.clearButton}>
          Clear History
        </button>
      )}
    </div>
  );
};

export default MessageHistory;
