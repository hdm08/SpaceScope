import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import {BASE_SKAI_API_URL} from '../components/api';

function Chat() {
  const [messages, setMessages] = useState([
    {
      text: "Hello!!! I am SKAI, a space knowledge AI, the NASA assistant. How may I help you today?",
      sender: "bot",
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch(`${BASE_SKAI_API_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Error fetching response. Please try again.', sender: 'bot' },
      ]);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-lg p-4 flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about NASA data..."
          className="flex-1 p-2 rounded bg-black bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="h-11 w-full sm:w-32 px-5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition"
          >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;