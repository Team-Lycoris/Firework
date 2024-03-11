import React, {useState, useEffect} from 'react';
import '../pages css/messages.css';
import {Link, useNavigate} from 'react-router-dom';
import { sendMessageRoute, getMessagesRoute, getGroupsRoute, createGroupRoute, createDMRoute, getSelfInfoRoute } from '../utils/apiRoutes';
import axios from 'axios';
import Chat from '../components/Chat';
import GroupList from '../components/GroupList';

const MessagesPage = () => {
  const navigate = useNavigate();
  // State to keep track of the selected conversation
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [user, setUser] = useState(null);

 useEffect(() => {
    const token = localStorage.getItem('user-token');

    // Check if the user has a token
    if (token === null) {
      navigate('/login');
    } else {
      // Add token to header for requests
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      // Request content from server
      getSelfInfo();
    }
  }, []);
  
  async function getSelfInfo() {
    const selfInfo = await axios.get(getSelfInfoRoute);
    if (selfInfo.data.status) {
      setUser(selfInfo.data.userInfo);
      console.log(selfInfo.data.userInfo);
    } else {
      // Some kind of error occurred
      console.error(selfInfo.data.msg)
    }
  }

  useEffect(() => {
    getGroups(user);
  }, [user])

  async function getGroups(user) {
    if (user) {
      const res = await axios.get(getGroupsRoute);
      if (res.data.status) {
        setGroups(res.data.groups);
        console.log(res.data.groups);
      }
      else {
        // Some kind of error occurred
        console.error(res.data.msg)
      }
    }
  }

  const createGroup = async () => {
    const res = await axios.post(createGroupRoute, {
      groupName: 'test',
      userIds: [
        1,
        2
      ]
    });
    if (res.data.status) {
      const updatedGroups = [...groups, res.data.group];
      setGroups(updatedGroups);
    } else {
      console.error(res.data.msg);
    }
  }

  const createDM = async () => {
    const res = await axios.post(createDMRoute, {
      otherUser: 1
    });
    console.log(res);
  }

  // Function to handle selecting a conversation
  const handleConversationSelect = (conversationId) => {
    setSelectedGroup(conversationId);
  };


 



  const handleConversationRequest = async (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    try {
      // Send a request to the server to initiate a conversation with the specified username
      const response = await axios.post('/api/conversations/request', { username });
      console.log(response.data); // Log the response from the server
    } catch (error) {
      console.error('Error requesting conversation:', error);
    }
  };

  return (
    <div className="messaging-container">

      <GroupList groups={groups} selectGroup={setSelectedGroup} />

      <Chat selectedGroup={selectedGroup}/>

      <Link to="/">
        <button className="back-button">Go Back</button>
      </Link>
      
      <div className="feature-buttons">
        <Link to="/">
          <button className="back-button">Go Back</button>
        </Link>
        
        <button onClick={createGroup}>Create group</button>

       <div className="conversation-request-form">
          <form onSubmit={handleConversationRequest}>
           <input
             type="text"
             placeholder="Enter username"
             name="username"
           />
            <button type="submit">Request Conversation</button>
          </form>
        </div>

        
      </div>
    </div>
  );
};

export default MessagesPage;
