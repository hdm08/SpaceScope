import React, {useState} from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import FavoritesPage from './pages/FavoritesPage';
import Navbar from './components/Navbar';
import WeatherDashboard from './pages/WeatherDashboard';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import NasaAgent from './pages/Agent/NasaAgent';
import CloseApproachTimeline from './pages/Neo/CloseApproachTimeline';
import HazardousAsteroidsMap from './pages/Neo/HazardousAsteroidsMap';
import HistoricCloseApproaches from './pages/Neo/HistoricCloseApproaches';
import HazardousStats from './pages/Neo/HazardousStats';
import SizeVsDistancePlot from './pages/Neo/SizeVsDistancePlot';
import AsteroidExplorerDashboard from './pages/Neo/AsteroidExplorerDashboard';
const App = () => {  
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/NasaAgent" element={<NasaAgent />} />
        <Route path="/neo/timeline" element={<CloseApproachTimeline />} />
        <Route path="/neo/map" element={<HazardousAsteroidsMap />} />
        <Route path="/neo/scatter" element={<SizeVsDistancePlot />} />
        <Route path="/neo/stats" element={<HazardousStats />} />
        <Route path="/neo/historic" element={<HistoricCloseApproaches />} />
        <Route path="/neo/dashboard" element={<AsteroidExplorerDashboard />} />

      </Routes>
    </div>
  );
};

export default App;
