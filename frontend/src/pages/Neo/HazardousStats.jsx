import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import DateForm from '../../components/DateForm';
import { useCache } from '../../components/CacheProvider'; // Import the useCache hook
import {VITE_BASE_BE_API_URL} from "../../components/api"
// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const today = new Date().toISOString().slice(0, 10);
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const HazardousStats = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const { getCache, setCache, isCacheValid } = useCache(); // Access cache functions

  const fetchAsteroids = async () => {
    // Validation: startDate and endDate should exist and startDate <= endDate
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      setLoading(false);
      return;
    }
    if (startDate > endDate) {
      setError('Start date cannot be after end date.');
      setLoading(false);
      return;
    }

    const cacheKey = `asteroids_stats_${startDate}_${endDate}`; // Unique cache key
    const cachedData = getCache(cacheKey);

    // Validate cached data
    if (isCacheValid(cacheKey) && cachedData && cachedData.near_earth_objects) {
      const nearEarthObjects = Object.values(cachedData.near_earth_objects).flat();
      setAsteroids(nearEarthObjects);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${VITE_BASE_BE_API_URL}/neo/feed`, {
        params: {
          SD: startDate,
          ED: endDate,
        },
      });
      const data = response.data;
      // Validate API response
      if (data && data.near_earth_objects) {
        setCache(cacheKey, data, 300000); // 5-minute TTL
        const nearEarthObjects = Object.values(data.near_earth_objects).flat();
        setAsteroids(nearEarthObjects);
      } else {
        setAsteroids([]);
        setError('Invalid data format received from API.');
      }
    } catch (err) {
      setAsteroids([]); // Fallback to empty array on error
      setError(`Failed to fetch asteroid data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchAsteroids();
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: ['Hazardous', 'Non-Hazardous'],
    datasets: [
      {
        data: [
          asteroids.filter(a => a.is_potentially_hazardous_asteroid).length,
          asteroids.filter(a => !a.is_potentially_hazardous_asteroid).length,
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } }, 
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Hazardous vs Non-Hazardous Stats</h2>
      <DateForm
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        fetchAsteroids={fetchAsteroids}
        loading={loading}
      />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : asteroids.length > 0 ? (
        <div className="mt-6">
          <Chart type="pie" data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="text-center mt-4">No asteroid data available.</p>
      )}
    </div>
  );
};

export default HazardousStats;