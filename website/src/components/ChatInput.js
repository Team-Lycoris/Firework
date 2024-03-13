import { useState } from 'react';

export default function ChatInput({ sendMessage }) {
    const [messageInput, setMessageInput] = useState('');

    function sendInput(event) {
        event.preventDefault();
        if (messageInput.length !== '') {
            sendMessage(messageInput)
            setMessageInput('');
        }
    }

    return (
        <form className="message-input">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit" onClick={sendInput}>Send</button>
        </form>
    );
}