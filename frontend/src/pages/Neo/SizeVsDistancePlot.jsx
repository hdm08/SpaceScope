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
import 'chart.js/auto'; 
import DateForm from '../../components/DateForm';
import dayjs from 'dayjs';
import { useCache } from '../../components/CacheProvider'; 
import {VITE_BASE_BE_API_URL} from '../../components/api'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const today = new Date().toISOString().slice(0, 10);
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const SizeVsDistancePlot = () => {
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getCache, setCache, isCacheValid } = useCache(); 

  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null);
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start, 'day');

    if (diff < 0) {
      setError('End date must be after start date.');
      setLoading(false);
      return;
    }
    if (diff > 7) {
      setError('Please select a date range within 7 days.');
      setLoading(false);
      return;
    }

    const cacheKey = `asteroids_size_distance_${startDate}_${endDate}`; 
    const cachedData = getCache(cacheKey);

    // Validate cached data
    if (isCacheValid(cacheKey) && cachedData && cachedData.near_earth_objects) {
      const asteroidList = Object.keys(cachedData.near_earth_objects).flatMap(date =>
        cachedData.near_earth_objects[date].map(asteroid => ({
          id: asteroid.id,
          name: asteroid.name,
          missDistance: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical),
          diameter: (
            asteroid.estimated_diameter?.kilometers?.estimated_diameter_min +
            asteroid.estimated_diameter?.kilometers?.estimated_diameter_max
          ) / 2,
          velocity: parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second),
          hazardous: asteroid.is_potentially_hazardous_asteroid,
        }))
      );
      setAsteroids(asteroidList);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${VITE_BASE_BE_API_URL}/neo/feed?start_date=${startDate}&end_date=${endDate}`);
      const data = response.data;
      if (data && data.near_earth_objects) {
        setCache(cacheKey, data, 300000); 
        const asteroidList = Object.keys(data.near_earth_objects).flatMap(date =>
          data.near_earth_objects[date].map(asteroid => ({
            id: asteroid.id,
            name: asteroid.name,
            missDistance: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical),
            diameter: (
              asteroid.estimated_diameter?.kilometers?.estimated_diameter_min +
              asteroid.estimated_diameter?.kilometers?.estimated_diameter_max
            ) / 2,
            velocity: parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second),
            hazardous: asteroid.is_potentially_hazardous_asteroid,
          }))
        );
        setAsteroids(asteroidList);
      } else {
        setAsteroids([]);
        setError('Invalid data format received from API.');
      }
    } catch (err) {
      setAsteroids([]); 
      setError('Failed to fetch asteroid data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, [startDate, endDate]); 
  const chartData = {
    datasets: [
      {
        label: 'Asteroids',
        data: asteroids.map(asteroid => ({
          x: asteroid.missDistance,
          y: asteroid.diameter,
          r: asteroid.velocity ? asteroid.velocity / 2 : 5, 
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
        title: { display: true, text: 'Miss Distance (AU)', color: 'white' },
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
      y: {
        title: { display: true, text: 'Estimated Diameter (km)', color: 'white' },
        ticks: { color: 'white' },
        grid: { color: '#444' },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: context => [
            `Name: ${context.raw.asteroid.name}`,
            `Miss Distance: ${context.raw.asteroid.missDistance?.toFixed(4)} AU`,
            `Diameter: ${context.raw.asteroid.diameter?.toFixed(2)} km`,
            `Velocity: ${context.raw.asteroid.velocity?.toFixed(2)} km/s`,
            `Hazardous: ${context.raw.asteroid.hazardous ? 'Yes' : 'No'}`,
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
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Size vs Distance Plot</h2>
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
        <p className="text-center mt-4">Loading...</p>
      ) : asteroids.length > 0 ? (
        <div className="mt-6">
          <Bubble data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="text-center mt-4">No asteroid data available.</p>
      )}
    </div>
  );
};

export default SizeVsDistancePlot;