import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ text, sender }) => {
  return (
    <div className={`message ${sender}-message`}>
      {text}
    </div>
  );
};

export default ChatMessage;