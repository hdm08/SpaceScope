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
import DateForm from '../../components/DateForm';
import { useCache } from '../../components/CacheProvider'; 
import {BASE_BE_API_URL} from "../../components/api"

ChartJS.register(TimeScale, LinearScale, PointElement, Tooltip, Legend);

const today = new Date().toISOString().slice(0, 10);
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const CloseApproachTimeline = () => {
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [asteroids, setAsteroids] = useState([]);
  const [hazardousCount, setHazardousCount] = useState(0);
  const [nonHazardousCount, setNonHazardousCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getCache, setCache, isCacheValid } = useCache();

  const fetchAsteroids = async () => {
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

    const cacheKey = `asteroids_feed_${startDate}_${endDate}`; 
    const cachedData = getCache(cacheKey);

    // Validate cached data
    if (isCacheValid(cacheKey) && cachedData && cachedData.near_earth_objects) {
      const asteroidList = Object.keys(cachedData.near_earth_objects).flatMap(date =>
        cachedData.near_earth_objects[date].map(asteroid => ({
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
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_BE_API_URL}/neo/feed/`, {
        params: { SD: startDate, ED: endDate }
      });
      const data = response.data;
      // Validate API response
      if (data && data.near_earth_objects) {
        setCache(cacheKey, data, 300000); // 5-minute TTL
        const asteroidList = Object.keys(data.near_earth_objects).flatMap(date =>
          data.near_earth_objects[date].map(asteroid => ({
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
      } else {
        setAsteroids([]);
        setError('Invalid data format received from API.');
      }
    } catch (err) {
      setAsteroids([]); // Fallback to empty array on error
      setError('Failed to fetch asteroid data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, [startDate, endDate]); // Trigger fetch when dates change

  const chartData = {
    datasets: [
      {
        label: 'Asteroid Count',
        data: Object.keys(asteroids.reduce((acc, a) => {
          const date = a.date?.split(' ')[0];
          if (date) acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {})).map(date => ({
          x: dayjs(date).valueOf(),
          y: asteroids.filter(a => a.date?.split(' ')[0] === date).length
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        pointRadius: 6,
      },
      {
        label: 'Hazardous',
        data: Object.keys(asteroids.reduce((acc, a) => {
          if (a.hazardous) {
            const date = a.date?.split(' ')[0];
            if (date) acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {})).map(date => ({
          x: dayjs(date).valueOf(),
          y: asteroids.filter(a => a.hazardous && a.date?.split(' ')[0] === date).length
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        title: { display: true, text: 'Date', color: 'white' },
        ticks: { color: 'white' },
        grid: { color: '#444' }
      },
      y: {
        title: { display: true, text: 'Asteroid Count', color: 'white' },
        beginAtZero: true,
        ticks: { color: 'white' },
        grid: { color: '#444' }
      },
    },
    plugins: {
      legend: {
        labels: { color: 'white' },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Close Approach Timeline</h2>
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
        <p><strong>Hazardous:</strong> {hazardousCount} | <strong>Non-Hazardous:</strong> {nonHazardousCount}</p>
        <Chart type="scatter" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CloseApproachTimeline;