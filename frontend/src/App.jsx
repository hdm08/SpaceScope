import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import FavoritesPage from './pages/FavoritesPage';
import Navbar from './components/Navbar';
import WeatherDashboard from './pages/WeatherDashboard';
import Search from './pages/Search';
import NeoApp from './pages/Neo/Neo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
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
        <Route path="/archive/:year/:month" element={<ArchivePage />} />

        <Route path="/favorites" element={
          <PrivateRoute>
          <FavoritesPage />
        </PrivateRoute>
        } />

        <Route path="/mars_weather" element={<WeatherDashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/neo" element={<NeoApp />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
