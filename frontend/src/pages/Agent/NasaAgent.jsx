import React from 'react';
import Chat from "../../components/Chat";
const NasaAgent = () =>{
    return (
        <div className="min-h-screen bg-gradient-to-b from-transparent flex flex-col items-center p-4">
          <h1 className="text-4xl font-bold mb-6 text-indigo-700">SKAI (Space Knowledge AI)</h1>
          <Chat />
        </div>
      );
};

export default NasaAgent;