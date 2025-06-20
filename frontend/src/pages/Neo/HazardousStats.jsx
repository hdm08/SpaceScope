import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const HazardousStats = () => {
  // Optional: set some initial default dates (today and 7 days ago)
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const fetchAsteroids = async () => {
    // Validation: startDate and endDate should exist and startDate <= endDate
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (startDate > endDate) {
      setError('Start date cannot be after end date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:4000/api/neo/feed', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      // Flatten the data from feed structure
      const nearEarthObjects = Object.values(response.data.near_earth_objects).flat();
      setAsteroids(nearEarthObjects);
    } catch (err) {
      setError(`Failed to fetch asteroid data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // No automatic fetch on date change now
  // useEffect(() => {
  //   if (startDate && endDate) {
  //     fetchAsteroids();
  //   }
  // }, [startDate, endDate]);

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
      legend: { position: 'top' },
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-black text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Hazardous vs Non-Hazardous Stats</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            className="px-4 py-2 rounded-md border border-gray-500 bg-black text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            className="px-4 py-2 rounded-md border border-gray-500 bg-black text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <button
        className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        onClick={fetchAsteroids}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {!loading && asteroids.length > 0 && (
        <div className="mt-6">
          <Chart type="pie" data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default HazardousStats;
