import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';

function Chat() {
  const [messages, setMessages] = useState([]);
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
      const response = await fetch('http://localhost:8000/api/query', {
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
    <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-[80vh]">
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
          className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;