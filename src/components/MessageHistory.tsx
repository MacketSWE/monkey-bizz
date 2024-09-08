import React from "react";
import useGlobalState from "../hooks/useGlobalState";

function MessageHistory() {
  const { messages } = useGlobalState();

  return (
    <div className="h-full w-64 overflow-y-auto shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Message History</h2>
      {messages.map((message, index) => (
        <div key={index} className="mb-2 truncate">
          {message}
        </div>
      ))}
    </div>
  );
}

export default MessageHistory;
