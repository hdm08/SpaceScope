import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { color } from 'framer-motion';


// Register required chart.js components
ChartJS.register(PointElement, LinearScale, TimeScale, Tooltip, Legend);

const HistoricCloseApproaches = () => {
  const [asteroidId, setAsteroidId] = useState('3542519');
  const [asteroid, setAsteroid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAsteroid = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/neo/lookup/${asteroidId}`);
      setAsteroid(response.data);
    } catch (err) {
      setError('Failed to fetch asteroid data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroid();
  }, []);

  const chartData = {
    datasets: [
      {
        label: 'Miss Distance (AU)',
        data:
          asteroid?.close_approach_data
            .filter((approach) =>
              dayjs(approach.close_approach_date_full).isBefore(dayjs().subtract(1, 'year'))
            )
            .map((approach) => ({
              x: dayjs(approach.close_approach_date_full).valueOf(),
              y: parseFloat(approach.miss_distance.astronomical),
            })) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
        },
        title: {
          display: true,
          text: 'Close Approach Date',
          color: 'white',
        },
        ticks: { color: 'white',},
        grid: { color: '#444' },
      },
      y: {
        title: {
          display: true,
          text: 'Miss Distance (AU)',
          color: 'white',
        },
        beginAtZero: true,
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => [
            `Date: ${dayjs(context.raw.x).format('YYYY-MM-DD HH:mm')}`,
            `Distance: ${context.raw.y.toFixed(4)} AU`,
          ],
        },
      },
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opaque-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Historic Close Approaches</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Asteroid ID</label>
        <input
          type="text"
          value={asteroidId}
          onChange={(e) => setAsteroidId(e.target.value)}
          className="mt-1 block w-full border-white  bg-transparent text-white  rounded-md shadow-sm"
        />
        <button
          onClick={fetchAsteroid}
          className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Asteroid'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {asteroid && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">{asteroid.name}</h3>
          <Chart type="scatter" data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default HistoricCloseApproaches;
