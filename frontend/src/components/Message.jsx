import React from 'react';

function Message({ text, sender }) {
  const isUser = sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <span className="text-xs font-semibold mb-1 text-gray-500">
        {isUser ? 'You' : 'SKAI'}
      </span>
      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          isUser
            ? 'ml-auto bg-black bg-opacity-70 text-white'
            : 'mr-auto bg-white bg-opacity-70 text-black'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;
