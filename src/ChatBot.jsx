import { useState } from "react";
import MessageInput from "./components/MessageInput";
import "./ChatBot.css";

function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how can I help you today?", sender: "bot" }
  ]);
  
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
      </div>

      {/* This line MUST look like this 👇 */}
      <MessageInput setMessages={setMessages} />
    </div>
  );
}

export default ChatBot;