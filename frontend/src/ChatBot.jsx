import { useState, useEffect, useRef } from "react"; // 1. Added useRef here
import MessageInput from "./components/MessageInput";

function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how can I help you today?", sender: "bot" }
  ]);

  // 2. Create the reference anchor
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 3. Scroll to the empty div whenever messages array updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === "bot" ? "bot" : "user"}`}
          >
            {message.text}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput setMessages={setMessages} />
    </div>
  );
}

export default ChatBot;