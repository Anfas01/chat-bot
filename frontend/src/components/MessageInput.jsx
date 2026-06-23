import { useState } from "react";
import './MessageInput.css';

function MessageInput({ setMessages }) { 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      // Hit your local proxy server instead of Google directly
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }), 
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.text, 
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Chat Error:", error);
      
      // ✅ Added fallback message so the user knows if the server is down
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I can't reach the server right now. Make sure your backend is running!",
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="message-input">
      <input
        type="text"
        placeholder={isLoading ? "Bot is thinking..." : "Type a message"}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;