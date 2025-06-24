import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import 'chart.js/auto'; // ensures all required chart types are registered
import DateForm from '../../components/DateForm';
import dayjs from 'dayjs';

// Register chart components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const SizeVsDistancePlot = () => {
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null); 
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start, 'day');

    if (diff < 0) {
      setError('End date must be after start date.');
      return;
    }
    if (diff > 7) {
      setError('Please select a date range within 7 days.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/neo/feed?start_date=${startDate}&end_date=${endDate}`);
      const nearEarthObjects = response.data.near_earth_objects;
      const asteroidList = Object.keys(nearEarthObjects).flatMap(date =>
        nearEarthObjects[date].map(asteroid => ({
          id: asteroid.id,
          name: asteroid.name,
          missDistance: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical),
          diameter: (
            asteroid.estimated_diameter.kilometers.estimated_diameter_min +
            asteroid.estimated_diameter.kilometers.estimated_diameter_max
          ) / 2,
          velocity: parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second),
          hazardous: asteroid.is_potentially_hazardous_asteroid,
        }))
      );
      setAsteroids(asteroidList);
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
        label: 'Asteroids',
        data: asteroids.map(asteroid => ({
          x: asteroid.missDistance,
          y: asteroid.diameter,
          r: asteroid.velocity / 2,
          asteroid,
        })),
        backgroundColor: asteroids.map(asteroid =>
          asteroid.hazardous ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.8)'
        ),
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: { display: true, text: 'Miss Distance (AU)', color:'white'},
        ticks: {color: 'white'},grid: {color: '#444' }
      },
      y: {
        title: { display: true, text: 'Estimated Diameter (km)', color:'white' },
        ticks: {color: 'white'},grid: {color: '#444' },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: context => [
            `Name: ${context.raw.asteroid.name}`,
            `Miss Distance: ${context.raw.asteroid.missDistance.toFixed(4)} AU`,
            `Diameter: ${context.raw.asteroid.diameter.toFixed(2)} km`,
            `Velocity: ${context.raw.asteroid.velocity.toFixed(2)} km/s`,
            `Hazardous: ${context.raw.asteroid.hazardous ? 'Yes' : 'No'}`,
          ],
        },
      },
      legend: {
        labels: {
          color: 'white', // ← Legend label color
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Size vs Distance Plot</h2>
      <DateForm
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        fetchAsteroids={fetchAsteroids}
        loading={loading}
      />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <div className="mt-6">
        <Bubble data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SizeVsDistancePlot;
