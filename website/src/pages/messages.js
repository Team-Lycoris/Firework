import React, {useState, useEffect} from 'react';
import '../pages css/messages.css';
import {Link, useNavigate} from 'react-router-dom';
import { sendMessageRoute, getMessagesRoute, getGroupsRoute, createGroupRoute, createDMRoute, getSelfInfoRoute, sendFriendInviteRoute, acceptFriendInviteRoute } from '../utils/apiRoutes';
import axios from 'axios';
import Chat from '../components/Chat';
import GroupList from '../components/GroupList';
import ChatInput from '../components/ChatInput';
import CreateGroupModal from '../components/CreateGroupModal';

const MessagesPage = () => {
  const navigate = useNavigate();
  // State to keep track of the selected conversation
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [user, setUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const [invites, setInvites] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUser, setAddUser] = useState('');

  const handleRequestButtonClick = () => {
    setShowRequestForm(!showRequestForm);
  };

  const handleInviteButtonClick = () => {
    setShowInvitesModal(!showInvitesModal);
  }

 useEffect(() => {
    const token = localStorage.getItem('user-token');

    //Check if the user has a token
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
        const grps = res.data.groups.map((grp) => {
          if (grp.isDm) {
            const names = grp.name.split(' ');
            if (names.length > 1) {
              grp.name = names[0] === user.username ?
                names[1] : names[0];
            }
          }
          return grp;
        });

        setGroups(grps);
        console.log(grps);
      }
      else {
        // Some kind of error occurred
        console.error(res.data.msg)
      }
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
    try {
      setRequestError('');
      // Send a request to the server to initiate a conversation with the specified username
      const response = await axios.post(sendFriendInviteRoute, { 
        inviteeUsername: inviteUsername
      });
      console.log(response.data); // Log the response from the server

      if (response.data.status) {
        setShowRequestModal(false); // Hide modal after sending request
        setInviteUsername('');
      } else {
        setRequestError(response.data.msg);
        console.error(response.data.msg);
      }
    } catch (error) {
      setRequestError('Unknown error');
      console.error('Error requesting conversation:', error);
    }
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
  }

  const handleAcceptInvite = async (invite) => {
    try {
      const response = await axios.post('/api/invites/accept', { inviteId: invite.id });
      console.log(response.data); // Log the response from the server
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };
  
  const handleDeclineInvite = async (invite) => {
    try {
      const response = await axios.post('/api/invites/decline', { inviteId: invite.id });
      console.log(response.data); // Log the response from the server
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  return (
    <div className="messaging-container">

      <GroupList groups={groups} selectGroup={setSelectedGroup} />

      <Chat selectedGroup={selectedGroup} user={user}/>

      {showRequestModal && (
  <div className="request-modal">
    <div className="request-modal-content">
      <input
        type="text"
        placeholder="Enter username"
        onChange={(e) => setInviteUsername(e.target.value)}
      />
      <button onClick={handleConversationRequest}>Send Request</button>
      <button onClick={() => {
        setShowRequestModal(false);
        setInviteUsername('');
      }}>Cancel</button>
      {requestError &&
        <div className="request-error">{requestError}</div>
      }
    </div>
  </div>
)}

{showAddModal && (
  <div className="add-user-modal">
    <div className="add-user-modal-content">
      <input
        type="text"
        placeholder="Enter username"
        onChange={(e) => setAddUser(e.target.value)}
      />
      <button onClick={handleAddRequest}>Add User</button>
      <button onClick={() => {
        setShowAddModal(false);
        setAddUser('');
      }}>Cancel</button>
      {requestError &&
        <div className="request-error">{requestError}</div>
      }
    </div>
  </div>
)}

      {showInvitesModal && (
        <div className="invites-modal">
          <div className="invites-modal-content">

              {/* <button onClick={() => {
              setShowInvitesModal(false); // Hide modal after accepting or declining invite
            }}>Invites</button> */}
            <h2>Invites</h2>
            <ul>
              {invites.map((invites, index) => (
                <li key={index}>
                  <button onClick={() => handleAcceptInvite(invites)}>Accept</button>
                  <button onClick={() => handleDeclineInvite(invites)}>Decline</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowInvitesModal(false)}>Cancel</button>
          </div>
        </div>
      )}


<CreateGroupModal
          showModal={showGroupModal} 
          setShowModal={setShowGroupModal}
          setGroups={setGroups}
        />
      
      <div className="feature-buttons">

        <button onClick={() => setShowAddModal(true)}>Add User</button>
        
        <button onClick={() => setShowGroupModal(true)}>Create Group</button>

        <button onClick={() => setShowRequestModal(true)}>Send Request</button>

        <button onClick={() => setShowInvitesModal(true)}>Invites</button>
        
      </div>
    </div>
  );
};

export default MessagesPage;
