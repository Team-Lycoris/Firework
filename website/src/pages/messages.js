import React, {useState, useEffect, useRef} from 'react';
import '../pages css/messages.css';
import {Link, useNavigate} from 'react-router-dom';
import { sendMessageRoute, getMessagesRoute, getGroupsRoute, createGroupRoute, createDMRoute, getSelfInfoRoute, sendFriendInviteRoute, acceptFriendInviteRoute, getIncomingFriendInvitesRoute, declineFriendInviteRoute } from '../utils/apiRoutes';
import axios from 'axios';
import Chat from '../components/Chat';
import GroupList from '../components/GroupList';
import ChatInput from '../components/ChatInput';
import CreateGroupModal from '../components/CreateGroupModal';
import { io } from 'socket.io-client';

const HOST_URL = 'http://localhost:8080';

const MessagesPage = () => {
  const navigate = useNavigate();
  const socket = useRef();
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


 useEffect(() => {
    const token = localStorage.getItem('user-token');

    //Check if the user has a token
    if (token === null) {
      navigate('/login');
        } else {
      // Add token to header for requests
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      // Connect with web socket
      socket.current = io(HOST_URL, {
        auth: {
          token: token
        }
      });

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
    if(user) {
      fetchInvites();
      getGroups(user);
    }
  }, [user]);

  // Create listener to handle being added to groups and
  // receiving friend invites by other users using sockets
  useEffect(() => {
    if (socket.current) {
      socket.current.on('receive-group', receiveGroup);
      console.log('Group socket on');
      socket.current.on('receive-invite', receiveInvite);
      console.log('Invite socket on');

      return () => {
        socket.current.off('receive-group', receiveGroup);
        console.log('Group socket off');
        socket.current.off('receive-invite', receiveInvite);
        console.log('Invite socket off');
      }
    }
  }, [socket.current]);

  // Handles receiving a group from websockets
  function receiveGroup(data) { 
    console.log(data);
    if (data.group) {
      joinGroup(data.group);
    }
  }

  // Adds a group to the group list
  function joinGroup(group) {
    if (group.isDm) {
      const names = group.name.split(' ');
      if (names.length > 1) {
        group.name = names[0] === user.username ?
          names[1] : names[0];
      }
    }
    setGroups((grps) => [...grps, group]);
  }

  function receiveInvite(data) {
    console.log(data);
    if (data.invite) {
      setInvites((invts) => [...invts, data.invite]);
    }
  }

  const fetchInvites = async () => {
    try {
      const response = await axios.get(getIncomingFriendInvitesRoute);
      if (response.data.status) {
        setInvites(response.data.invites);
        console.log(response.data.invites);
      } else {
        console.error(response.data.msg);
      }
    } catch (error) {
      console.error('Failed to fetch invites');
    }
  }

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

        // Send an update to the recipient
        const socketData = {
          invite: response.data.invite,
          inviter: response.data.inviter,
          invitee: response.data.invitee
        }
        socket.current.emit('send-friend-invite', socketData);

      } else {
        setRequestError(response.data.msg);
        console.error(response.data.msg);
      }
    } catch (error) {
      setRequestError('Unknown error');
      console.error('Error requesting conversation:', error);
    }
  };

  const handleAcceptInvite = async (invite) => {
    try {
      const response = await axios.post(acceptFriendInviteRoute, { inviterId: invite.inviter });
      console.log(response.data); // Log the response from the server

      if (response.data.status) {
        // Send an update to the inviter
        const socketData = {
          group: response.data.group,
          inviteeId: invite.inviter
        }
        socket.current.emit('add-to-group', socketData);

        // Add the group to the group list
        joinGroup(response.data.group);
        
        console.log(invites.indexOf(invite));
        setInvites(invites.toSpliced(invites.indexOf(invite), 1));
      }
      else {
        console.error("Error accepting invite:", response.data.msg);
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };
  
  const handleDeclineInvite = async (invite) => {
    try {
      const response = await axios.post(declineFriendInviteRoute, { inviterId: invite.inviter });
      console.log(response.data); // Log the response from the server

      if (response.data.status) {
        console.log('Invite deleted:', invite);

        setInvites(invites.toSpliced(invites.indexOf(invite), 1));
      }
      else {
        console.error('Error declining invite:', response.data.msg);
      }
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  function anyModalOpen() {
    return showRequestModal || showGroupModal || showInvitesModal;
  }

  return (
    <div className="messaging-container">

      <GroupList groups={groups} selectGroup={setSelectedGroup} />

      {selectedGroup && 
        <Chat selectedGroup={selectedGroup} user={user} socket={socket} />
      }
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

      {showInvitesModal && (
        <div className="invites-modal">
          <div className="invites-modal-content">
            <h2>Invites</h2>
              {invites.length === 0 &&
                <div>You have no invites</div>}
              {invites.map((invite, index) => (
                <div key={index}>
                  {invite.inviterName}
                  <button onClick={() => handleAcceptInvite(invite)}>Accept</button>
                  <button onClick={() => handleDeclineInvite(invite)}>Decline</button>
                </div>
              ))}
          
            <button onClick={() => setShowInvitesModal(false)}>Close</button>
          </div>
        </div>
      )}


      <CreateGroupModal
        showModal={showGroupModal} 
        setShowModal={setShowGroupModal}
        setGroups={setGroups}
        setSelectedGroup={setSelectedGroup}
      />
      
      <div className="feature-buttons">
        
        <button onClick={() => !anyModalOpen() && setShowGroupModal(true)}>Create Group</button>

        <button onClick={() => !anyModalOpen() && setShowRequestModal(true)}>Send Request</button>

        <button onClick={() => !anyModalOpen() && setShowInvitesModal(true)}>Invites</button>
        
      </div>
    </div>
  );
};

export default MessagesPage;
