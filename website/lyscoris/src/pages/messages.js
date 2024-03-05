import React from 'react';
import '../pages css/messages.css';

const MessagesPage = () => {
  return (
    <div className="messaging-container">
      <div className="conversations-list">
        <div className="conversation">
            <button class="button converstation-select active-person" id="Converstation1">Conversation 1</button>
        </div>
        <div className="conversation">
            <button class="button converstation-select" id="Converstation2">Conversation 2</button>
        </div>
        <div className="conversation">
            <button class="button converstation-select" id="Converstation3">Conversation 3</button>
        </div>
      </div>
      <div className="chat-display">
        <div className="message">Test</div>
        <div className="message">Test 2</div>

        <div className="message-input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
