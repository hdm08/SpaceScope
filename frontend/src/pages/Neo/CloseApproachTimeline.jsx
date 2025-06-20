import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';
import { color } from 'framer-motion';

// Register necessary Chart.js components
ChartJS.register(TimeScale, LinearScale, PointElement, Tooltip, Legend);

const CloseApproachTimeline = () => {
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-07');
  const [asteroids, setAsteroids] = useState([]);
  const [hazardousCount, setHazardousCount] = useState(0);
  const [nonHazardousCount, setNonHazardousCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAsteroids = async () => {
    setError(null); // clear previous errors
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start, 'day');
  
    if (diff < 0) {
      setError('End date must be after start date.');
      return;
    }
  
    if (diff > 6) {
      setError('Please select a date range within 7 days.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/neo/feed/", {
        params: { SD: startDate, ED: endDate }
      });
  
      const nearEarthObjects = response.data.near_earth_objects;
      const asteroidList = Object.keys(nearEarthObjects).flatMap(date =>
        nearEarthObjects[date].map(asteroid => ({
          id: asteroid.id,
          name: asteroid.name,
          date: asteroid.close_approach_data[0]?.close_approach_date_full,
          missDistance: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical),
          velocity: parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second),
          hazardous: asteroid.is_potentially_hazardous_asteroid,
        }))
      );
      setAsteroids(asteroidList);
      setHazardousCount(asteroidList.filter(a => a.hazardous).length);
      setNonHazardousCount(asteroidList.filter(a => !a.hazardous).length);
    } catch (err) {
      setError('Failed to fetch asteroid data');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAsteroids();
  }, []);

  const chartData = {
    datasets: [
      {
        label: 'Asteroid Count',
        data: Object.keys(asteroids.reduce((acc, a) => {
          const date = a.date.split(' ')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {})).map(date => ({ x: dayjs(date).valueOf(), y: asteroids.filter(a => a.date.split(' ')[0] === date).length })),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        pointRadius: 6,
      },
      {
        label: 'Hazardous',
        data: Object.keys(asteroids.reduce((acc, a) => {
          if (a.hazardous) {
            const date = a.date.split(' ')[0];
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {})).map(date => ({ x: dayjs(date).valueOf(), y: asteroids.filter(a => a.hazardous && a.date.split(' ')[0] === date).length })),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { type: 'time', time: { unit: 'day' }, title: { display: true, text: 'Date', color: 'white'}, ticks: {color: 'white'},grid: {color: '#444' } },
      y: { title: { display: true, text: 'Asteroid Count', color: 'white' }, beginAtZero: true, ticks: {color: 'white'},grid: {color: '#444' } },
    },plugins: {
        legend: {
          labels: {
            color: 'white', // ← Legend label color
          },
        },
      

    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 text-white  p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Close Approach Timeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white">Start Date</label>
          
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="mt-1 block w-full border-white  bg-transparent text-white rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mt-1 block w-full border-white  bg-transparent text-white rounded-md shadow-sm"
          />
        </div>
      </div>
      <button
        onClick={fetchAsteroids}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Asteroids'}
      </button>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <div className="mt-6">
        <p><strong>Hazardous:</strong> {hazardousCount} | <strong>Non-Hazardous:</strong> {nonHazardousCount}</p>
        <Chart type="scatter" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CloseApproachTimeline;