import { useState } from 'react';

export default function ChatInput({ sendMessage }) {
    const [messageInput, setMessageInput] = useState('');

    function sendInput() {
        if (messageInput.length !== '') {
            sendMessage(messageInput)
            setMessageInput('');
        }
    }

    return (
        <div className="message-input">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendInput}>Send</button>
        </div>
    );
}