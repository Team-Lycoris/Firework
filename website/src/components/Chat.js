import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import { Link } from "react-router-dom";
import { sendMessageRoute, getMessagesRoute } from "../utils/apiRoutes";

export default function Chat({ selectedGroup, user }) {

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log('Getting messages');
        getMessages();
    }, [selectedGroup]);

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
                        type: 'text'
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
    //temp event assignment for testing purposes
    const sendMessage = async (message) => {
        if (message !== '' && selectedGroup) {
            const updatedMessages = [...messages, {
                content: message,
                author: user.id,
                username: user.username,
                type: 'text',
                event: latitude !== null && longitude != null ? 0 : null
              }
            ];
            setMessages(updatedMessages);

            console.log(selectedGroup);
            if (latitude !== null && longitude !== null)
            {
              const event = {
                author: user.id,
                longitude: longitude,
                latitude: latitude,
              }

              setLatitude(null);
              setLongitude(null);

              // For testing
              const res = await axios.post(sendMessageRoute + '/' + selectedGroup.id, {
                message: message,
                event: event
              });

              if (res.data.status) {
                // The message was sent
                console.log("Message sent:", message);
              } else {
                  // An error was returned by the server
                  console.log(res.data.msg);
              }
            }
            else{
                // For testing
            const res = await axios.post(sendMessageRoute + '/' + selectedGroup.id, {
              message: message,
            });

          if (res.data.status) {
            // The message was sent
            console.log("Message sent:", message);
          } else {
              // An error was returned by the server
              console.log(res.data.msg);
          }
              }
          }
    }
//author lat long

  const getLocation = () => {
    if (selectedGroup) {
            if (navigator.geolocation){
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setLatitude(position.coords.latitude);
                  setLongitude(position.coords.longitude);
                  /*const embeddedMessage = { content: "My location!", type: "location", latitude, longitude };
                  const updateConversation = [...messages, embeddedMessage];
                  setMessages(updateConversation);*/
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
                            <p className="message-content">
                            {
                                message.event === null ? 
                                message.content : 
                                <div> <p>{message.content}</p>
                                <Link to={"/map"}>My Location</Link>
                                </div>
                                }
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="location-send">
                <button onClick={getLocation}>Send my location</button>
            </div>

            {selectedGroup && <ChatInput sendMessage={sendMessage} />}
        </div>
    );
}
