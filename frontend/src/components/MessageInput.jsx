import { useState } from "react";

function MessageInput({ setMessages }) { 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fallback to localhost if the VITE_BACKEND_URL environment variable isn't found
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
      // Dynamically targeting your live backend server URL
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
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