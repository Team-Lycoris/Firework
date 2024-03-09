import React, {useState} from 'react';
import '../pages css/messages.css';
import {Link} from 'react-router-dom';


const MessagesPage = () => {
  // State to keep track of the selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState({
    Conversation1: [
      {content: 'Message 1 for conversation 1', type: 'text'},
      {content: 'Message 2 for conversation 1', type: 'text'},
    ],
    Conversation2: [
      {content: 'Message 1 for conversation 2', type: 'text'},
      {content: 'Message 2 for conversation 2', type: 'text'},
    ],
    Conversation3: [
      {content: 'Message 1 for conversation 3', type: 'text'},
      {content: 'Message 2 for conversation 3', type: 'text'},
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
        [selectedConversation]: [...conversations[selectedConversation], {content: messageInput, type: 'text'}]
      };
      setConversations(updatedConversations);
      setMessageInput('');
    }
  }

  const sendLocation = () => {
    const embeddedMessage = {content: "My location!", type: "location"};
    if (selectedConversation){
      const updateConversation = {
        ...conversations,
        [selectedConversation]: [...conversations[selectedConversation], embeddedMessage]
      };
      setConversations(updateConversation);
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
          <div className="message" key={index}>{
            message.type === 'text' ? 
           <p>{message.content}</p> :
            <Link to="/map">My Location</Link>
          }
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

      <div className="location-send">
        <button onClick={sendLocation}>Send my location</button> 
      </div>
      
    </div>
  );
};

export default MessagesPage;
