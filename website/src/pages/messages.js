import React, {useState} from 'react';
import '../pages css/messages.css';
import {Link} from 'react-router-dom';


const MessagesPage = () => {
  // State to keep track of the selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Function to handle selecting a conversation
  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const conversations = {
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
        <div className="conversation">
            <button 
              className={`button conversation-select ${
                selectedConversation === 'Conversation1' ?
                'active-person' : '' }`}
                onClick={() => handleConversationSelect('Conversation1')} 
                id="Conversation1"
              >Conversation 1
            </button>
        </div>

        <div className="conversation">
            <button 
            className={`button conversation-select ${
              selectedConversation === 'Conversation2' ? 'active-person' : ''
             }`}
             onClick={() => handleConversationSelect('Conversation2')} 
             id="Conversation2"
             >Conversation 2
             </button>
        </div>

        <div className="conversation">
            <button 
            className={`button conversation-select ${
              selectedConversation === 'Conversation3' ? 'active-person' : ''
             }`}
             onClick={() => handleConversationSelect('Conversation3')} 
             id="Conversation3"
             >Conversation 3
             </button>
        </div>
      </div>

      <div className="chat-display">
        {getConversation().map((message, index) => (
          <div className="message" key={index}>
            {message}
            </div>
        ))}

        <div className="message-input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>

        </div>
      </div>

      <Link to="/">
        <button className="back-button">Go Back</button>
      </Link>
      
    </div>
  );
};

export default MessagesPage;
