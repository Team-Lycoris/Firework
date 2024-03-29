import { useEffect, useState } from "react";
import '../pages css/messages.css';
import ChatInput from "./ChatInput";
import axios from "axios";
import { Link } from "react-router-dom";
import { sendMessageRoute, getMessagesRoute, addUserToGroupRoute } from "../utils/apiRoutes";

import Config from "../config.json";

export default function Chat({ selectedGroup, user, socket }) {

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [requestError, setRequestError] = useState('');
    const [messages, setMessages] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addUser, setAddUser] = useState('');

    // Fetch messages when the selected group is changed
    useEffect(() => {
        console.log('Getting messages');
        getMessages();
    }, [selectedGroup]);

    // Fetch messages from the server
    async function getMessages() {
        if (selectedGroup) {
            const res = await axios.get(getMessagesRoute + '/' + selectedGroup.id);
            console.log(res);
            if (res.data.status) {
                const msgs = res.data.messages.map((msg) => {
                    const data = {
                        id: msg.id,
                        author: msg.author,
                        content: msg.content,
                        username: msg.username,
                        latitude: msg.latitude,
                        longitude: msg.longitude
                    }
                    return data;
                });
                setMessages(msgs);
            }
            else {
                // An error occurred
                console.error(res.data.msg);
            }

        }
    }

    // Create listener to handle receiving messages
    // from other users using sockets
    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-message', receiveMessage);
            console.log('Message socket on');

            return () => {
                socket.current.off('receive-message', receiveMessage);
                console.log('Message socket off');
            }
        }
    }, [selectedGroup]);

    // Adds a message to the message array
    function receiveMessage(data) {
        console.log(data);
        if (selectedGroup && data.groupId == selectedGroup.id) {
            //setReceivedMessage(data.message);
            setMessages((msgs) => [...msgs, data.message]);
        }
        pushNotification(data);
    }

    function pushNotification(data) {
        if (user.id === data.message.author)
            return

        if (Notification.permission === "default") {
            Notification.requestPermission().then((result) => console.log(result));
        }

        if (Notification.permission === "granted") {
            const title = data.authorName + (data.isDm ? "" : " in " + data.groupName);
            const notif = new Notification(title, { body: data.message.content });
        }
    }

    // Handle adding a user to the currently selected group
    const handleAddRequest = async (username) => {
        setRequestError('');
        try {
            // Await a response from the server
            const res = await axios.post(addUserToGroupRoute, {
                groupId: selectedGroup.id,
                inviteeUsername: username
            });

            if (res.data.status) {
                // The user was added to the group.
                console.log(username + " added to group " + selectedGroup.id);
                // Clear the input field and hide the modal
                setAddUser('');
                setShowAddModal(false);

                // Send an update to the recipient
                const socketData = {
                    group: res.data.group,
                    inviteeId: res.data.invitee.id
                }
                socket.current.emit('add-to-group', socketData);
            } else {
                // An error occurred when trying to invite the user
                console.error('Error adding user to group:', res.data.msg);
                // Set the error field
                setRequestError(res.data.msg);
            }
        } catch(ex) {
            console.error('Error adding user to group:', ex);
            setRequestError('Unknown error');
        }

    }

    //temp event assignment for testing purposes
    const sendMessage = async (message) => {
        if (message !== '' && selectedGroup) {
            console.log(selectedGroup);
            // Send the message to the database
            const res = await axios.post(sendMessageRoute + '/' + selectedGroup.id, {
                message: message,
                latitude: latitude,
                longitude: longitude
            });

            if (latitude !== null && longitude !== null)
            {
                setLatitude(null);
                setLongitude(null);
            }

            if (res.data.status) {
                // The message was sent
                console.log("Message sent:", res.data.message);

                // Update the message history
                const updatedMessages = [...messages, {
                    id: res.data.message.id,
                    content: res.data.message.content,
                    author: res.data.message.author,
                    username: res.data.message.username,
                    latitude: res.data.message.latitude,
                    longitude: res.data.message.longitude
                }];
                setMessages(updatedMessages);

                // Send the message to other connected users
                const data = {
                    message: res.data.message,
                    groupId: selectedGroup.id
                }
                // Send the message to other users
                socket.current.emit('send-message', data);
            } else {
                // An error was returned by the server
                console.log(res.data.msg);
            }
        }
    }

// get user location coordinates through geolocation
  const getLocation = () => {
    if (selectedGroup) {
            if (navigator.geolocation){
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setLatitude(position.coords.latitude);
                  setLongitude(position.coords.longitude);
                  
          },
          (error) => {
            console.log('Error getting location', error);
          }
        );
    }
    else {
      console.log("Geolocation not supported");
    }
    }
  }


    return (
        <div className="chat-display">
            <div className="chat-header">
                <h2 className="group-name">{selectedGroup.name}</h2>
            </div>


            <div className="message-list-wrapper">
                <div className="message-list">
                    {messages.map((message, index) => (
                        <div className={"message-container " + (message.username === user.username ? "self" : "other")} key={index}>
                            <p className="author">{message.username}</p>
                            <div className="message-content">
                            {
                                message.latitude !== null && message.longitude !== null ?
                                <Link to={Config.googleMapKey === "" ?
                                "https://maps.google.com/maps?q=" + message.latitude + "," + message.longitude :
                                "/map"} state={{ lat: message.latitude, long: message.longitude }}><b>{message.content}</b></Link> :
                                <div>{message.content}</div>
                            }
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          {showAddModal && (
          <div className="add-user-modal">
            <div className="add-user-modal-content">
              <input
                type="text"
                placeholder="Enter username"
                value={addUser}
                onChange={(e) => setAddUser(e.target.value)}
              />
              <button onClick={() => {
                handleAddRequest(addUser);
                }}>Add User</button>
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

            <div className="chat-features">
                <button onClick={getLocation}>Send my location</button>
                {!selectedGroup.isDm && <button onClick={() => setShowAddModal(true)}>Add User</button>}
            </div>

            {selectedGroup && <ChatInput sendMessage={sendMessage} />}
        </div>
    );
}
