import React from 'react';

function Message({ text, sender }) {
  return (
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        sender === 'user'
          ? 'ml-auto bg-black bg-opacity-70 text-white'
          : 'mr-auto bg-white bg-opacity-70 text-black'
      }`}
    >
      {text}
    </div>
  );
}

export default Message;