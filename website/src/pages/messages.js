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
        [selectedConversation]: [...conversations[selectedConversation], {content: messageInput, type: 'text'}]
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
