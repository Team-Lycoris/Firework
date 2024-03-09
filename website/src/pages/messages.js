import React, {useState, useEffect} from 'react';
import '../pages css/messages.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const messageRoute = 'http://localhost:8080/api/user/test';

const MessagesPage = () => {
  const navigate = useNavigate();
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
  });

  useEffect(() => {
    const token = localStorage.getItem('user-token');

    // Check if the user has a token
    if (token === null) {
      navigate('/login');
    } else {
      // Add token to header for requests
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      // Request content from server
    }
  }, []);

  // Function to handle selecting a conversation
  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const sendMessage = async () => {
    if (messageInput !== '' && selectedConversation) {
      const updatedConversations = {
        ...conversations,
        [selectedConversation]: [...conversations[selectedConversation], messageInput]
      };
      setConversations(updatedConversations);
      setMessageInput('');

      // For testing
      const res = await axios.post(messageRoute, {
        message: messageInput
      });

      if (res.data.status) {
        // The message was sent
        console.log("Message sent:", messageInput);
      } else {
        // An error was returned by the server
        console.log(res.data.msg);
      }
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
