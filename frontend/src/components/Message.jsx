import React from 'react';

function Message({ text, sender }) {
  return (
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        sender === 'user'
          ? 'ml-auto bg-blue-600 text-white'
          : 'mr-auto bg-gray-700 text-white'
      }`}
    >
      {text}
    </div>
  );
}

export default Message;