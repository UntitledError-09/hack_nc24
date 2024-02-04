// ChatDialog.js
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './ChatDialog.css'; // Import the CSS file for styling

const ChatDialog = ({ open, onClose, person }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages(prevMessages => ({
        ...prevMessages,
        [person]: [...(prevMessages[person] || []), { sender: 'You', text: message }]
      }));
      setMessage('');
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <div className={`chat-dialog ${open ? 'open' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">{person}</div>
        <button className="close-button" onClick={handleClose}><CloseIcon /></button>
      </div>
      <div className="chat-messages" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {messages[person] && messages[person].map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender === 'You' ? 'you' : 'other'}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        <button className="send-button" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatDialog;