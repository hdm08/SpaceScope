import React, { useState, useEffect } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import axios from 'axios';
import {BASE_BE_API_URL} from "../components/api"

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSol, setSelectedSol] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_BE_API_URL}/weather`);
  
          const data = response.data;
          const validSols = Object.fromEntries(
            Object.entries(data).filter(
              ([sol, solData]) =>
                sol !== 'validity_checks' &&
                sol !== 'sol_keys' &&
                data.validity_checks[sol]?.AT?.valid
            )
          );
  
          setWeatherData(validSols);
        } catch (err) {
          setError('Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleCardClick = (solData) => {
      setSelectedSol(solData);
    };
  
    return (
        <div
          className="min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('https://example.com/mars-lander.jpg')" }}
        >
          <div className="container mx-auto p-6 text-white max-w-screen-xl">
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Latest Weather at Elysium Planitia</h1>
              <p className="text-lg max-w-2xl">
              The InSight lander stopped transmitting data after running out of power (due to dust covering its solar panels). As a result No new weather data is being collected on Mars by InSight.
              </p>
            </div>
      
            {/* MAIN SOL CARD */}
            {!loading && !error && weatherData && Object.keys(weatherData).length > 0 && (
              (() => {
                const latestSolKey = Object.keys(weatherData).slice(-1)[0];
                const latestSol = weatherData[latestSolKey];
                const date = new Date(latestSol.First_UTC).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
      
                return (
                  <div className="bg-black bg-opacity-50 p-6 rounded-xl shadow-lg mb-8 max-w-md">
                    <h2 className="text-3xl font-bold">Sol {latestSolKey}</h2>
                    <p className="text-lg mb-2">{date}</p>
                    <div className="text-xl">
                      <p>High: {latestSol.AT?.mx ?? 'N/A'}° F</p>
                      <p>Low: {latestSol.AT?.mn ?? 'N/A'}° F</p>
                    </div>
                  </div>
                );
              })()
            )}
      
            {/* HORIZONTAL SOL STRIP */}
            {error && <ErrorMessage message={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {Object.entries(weatherData)
                  .slice(-7) // Last 7 sols
                  .map(([solKey, solData]) => {
                    const date = new Date(solData.First_UTC).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
      
                    return (
                      <div
                        key={solData.First_UTC}
                        className="min-w-[180px] bg-black bg-opacity-40 p-4 rounded-md shadow hover:scale-105 transition-transform flex-shrink-0"
                        onClick={() => handleCardClick(solData)}
                      >
                        <h3 className="font-bold text-lg">Sol {solKey}</h3>
                        <p className="text-sm mb-2">{date}</p>
                        <p className="text-sm">High: {solData.AT?.mx ?? 'N/A'}° F</p>
                        <p className="text-sm">Low: {solData.AT?.mn ?? 'N/A'}° F</p>
                      </div>
                    );
                  })}
              </div>
            )}
      
            {/* MODAL FOR SELECTED SOL */}
            {selectedSol && (
              <Modal onClose={() => setSelectedSol(null)}>
                <div className="space-y-2 text-white">
                  <h2 className="text-xl font-semibold">
                    Sol {Object.keys(weatherData).find(key => weatherData[key] === selectedSol)} Details
                  </h2>
                  <p>Date: {new Date(selectedSol.First_UTC).toISOString().split('T')[0]}</p>
                  <p>High: {selectedSol.AT?.mx ?? 'N/A'}°F</p>
                  <p>Low: {selectedSol.AT?.mn ?? 'N/A'}°F</p>
                  <p>
                    Wind: {selectedSol.HWS?.av ?? 'N/A'} m/s (Most Common:{' '}
                    {selectedSol.WD?.most_common?.compass_point || 'N/A'})
                  </p>
                  <p>Pressure: {selectedSol.PRE?.av ?? 'N/A'} Pa</p>
                </div>
              </Modal>
            )}
          </div>
        </div>
      );
      
  };
  
  export default WeatherDashboard;