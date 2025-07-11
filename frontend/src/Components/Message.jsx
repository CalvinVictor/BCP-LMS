import React from "react";

const Message = ({ message }) => {
  if (!message.text) return null;

  return (
    <div
      className={`mb-4 p-3 rounded-lg text-sm text-center ${
        message.type === "error"
          ? "bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-400"
          : "bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 text-green-400"
      }`}
    >
      {message.text}
    </div>
  );
};

export default Message;
