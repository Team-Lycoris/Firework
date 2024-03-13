import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import { Link } from "react-router-dom";
import { sendMessageRoute, getMessagesRoute } from "../utils/apiRoutes";

export default function Chat({ selectedGroup, user }) {
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

    const sendMessage = async (message) => {
        if (message !== '' && selectedGroup) {
            const updatedMessages = [...messages, {
                content: message,
                author: user.id,
                username: user.username,
                type: 'text'
            }];
            setMessages(updatedMessages);

            console.log(selectedGroup);

            // For testing
            const res = await axios.post(sendMessageRoute + '/' + selectedGroup.id, {
                message: message
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

    /* const GetLocation = () =>{
    const [userLocation, setLocation] = useState({ latitude: null, longitude: null });
    if(navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(
        (position) => 
        {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,

          //change to store in database
        });

        console.log('got location');

      },
      (error) => {
        console.log('Error getting location');
      }
      );
    }
    else {
      console.log("Geolocation not supported");
    }
    return userLocation;
  };*/

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const embeddedMessage = { content: "My location!", type: "location", latitude, longitude };

          if (selectedGroup) {
            
            const updateConversation = [...messages, embeddedMessage];
            setMessages(updateConversation);
          }
        },
        (error) => {
          console.log('Error getting location', error);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  };
  /*
  const sendLocation = () => {

    const embeddedMessage = {content: "My location!", type: "location", latitude: GetLocation.latitude, longitude: GetLocation.longitude};
    /*
    const embeddedMessage = {content: "My location!", type: "location"};
    if (selectedConversation){
      const updateConversation = {
        ...conversations,
        [selectedConversation]: [...conversations[selectedConversation], embeddedMessage]

      };
      setConversations(updateConversation);
        const updateConversation = {
            ...conversations,
            [selectedConversation]: [...conversations[selectedConversation], embeddedMessage]
        };
        setConversations(updateConversation);
    }
  }*/

    return (
        <div className="chat-display">
            {messages.map((message, index) => (
                <div key={index}>
                    { <p className="author">{message.username}</p>}
                    {
                        message.type === 'text' ? 
                        <p className="message" >{message.content}</p> :
                        <Link to={`/map?lat=${message.latitude}&lng=${message.longitude}`}>My Location</Link>
                    }
                </div>
            ))}
            <div className="location-send">
                <button onClick={sendLocation}>Send my location</button> 
            </div>
            
            {selectedGroup && <ChatInput sendMessage={sendMessage} />}

            
        </div>
    );
}