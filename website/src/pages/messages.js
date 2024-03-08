import React, {useState} from 'react';
import '../pages css/messages.css';
import {Link} from 'react-router-dom';


const MessagesPage = () => {
  // State to keep track of the selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState({
    Conversation1: [
      'Message 1 for conversation 1',
      'Message 2 for conversation 1',
    ],
    Conversation2: [
      'Message 1 for conversation 2',
      'Message 2 for conversation 2',
    ],
    Conversation3: [
      'Message 1 for conversation 3',
      'Message 2 for conversation 3',
    ]
  })

  // Function to handle selecting a conversation
  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const sendMessage = () => {
    if (messageInput !== '' && selectedConversation) {
      const updatedConversations = {
        ...conversations,
        [selectedConversation]: [...conversations[selectedConversation], messageInput]
      };
      setConversations(updatedConversations);
      setMessageInput('');
    }
  }

  const getConversation = () => {
    if (selectedConversation) {
      return conversations[selectedConversation];
    }
    else {
      return [];
    }
  }

  return (
    <div className="messaging-container">

      <div className="conversations-list">
      {Object.keys(conversations).map((conversationId) => (
        <div className="conversation" key={conversationId}>
            <button 
              className={`button conversation-select ${
                selectedConversation === conversationId ?
                'active-person' : '' }`}
                onClick={() => handleConversationSelect(conversationId)} 
              >{conversationId}
            </button>
        </div>
      ))}
      </div>

      <div className="chat-display">
        {getConversation().map((message, index) => (
          <div className="message" key={index}>{message}
            </div>))}

        <div className="message-input">
          <input 
          type="text" 
          placeholder="Type a message..." 
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>

        </div>
      </div>

      <Link to="/">
        <button className="back-button">Go Back</button>
      </Link>
      
    </div>
  );
};

export default MessagesPage;
