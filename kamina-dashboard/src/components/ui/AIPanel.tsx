// src/components/ui/AIPanel.tsx
import React, { useState } from 'react';

export function AIPanel() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'ai', content: 'Hello! I\'m Kamina AI Assistant. How can I help you with your crypto journey today?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newConversation = [
      ...conversation,
      { role: 'user', content: message },
      { role: 'ai', content: 'I understand your question about ' + message + '. Let me analyze that for you...' }
    ];
    
    setConversation(newConversation);
    setMessage('');
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>🤖 AI Assistant</h3>
      
      <div style={styles.conversation}>
        {conversation.map((msg, index) => (
          <div key={index} style={msg.role === 'ai' ? styles.aiMessage : styles.userMessage}>
            <div style={msg.role === 'ai' ? styles.aiBubble : styles.userBubble}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <div style={styles.inputSection}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything about crypto..."
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button style={styles.sendButton} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  conversation: {
    flex: 1,
    overflowY: 'auto' as const,
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  aiMessage: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#f1f3f4',
    padding: '0.75rem 1rem',
    borderRadius: '18px',
    maxWidth: '80%',
    color: '#1a1a1a',
  },
  userBubble: {
    backgroundColor: '#667eea',
    padding: '0.75rem 1rem',
    borderRadius: '18px',
    maxWidth: '80%',
    color: 'white',
  },
  inputSection: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  sendButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};
