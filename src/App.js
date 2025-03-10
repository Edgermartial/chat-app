import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend server

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  
  // Get the chat history from the server
  useEffect(() => {
    socket.on('chat history', (messages) => {
      setMessages(messages);
    });

    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    
    return () => {
      socket.off('chat history');
      socket.off('chat message');
    };
  }, []);
  
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() && username.trim()) {
      socket.emit('chat message', { username, message });
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Chat</h1>
      
      {/* Username input */}
      {!username && (
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      
      {/* Chat messages */}
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </li>
        ))}
      </ul>
      
      {/* Message input and send button */}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
