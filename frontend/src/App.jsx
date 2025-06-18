import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

const App = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return (
    <div className="min-h-screen bg-transparent text-white" >
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-10" >
        <source src="/media/space.mp4" type="video/mp4" />
      </video>

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
