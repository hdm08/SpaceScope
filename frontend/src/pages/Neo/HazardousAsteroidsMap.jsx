import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DateForm from '../../components/DateForm';
import dayjs from 'dayjs';
import { useCache } from '../../components/CacheProvider'; // Import the useCache hook

const today = new Date().toISOString().slice(0, 10);
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const HazardousAsteroidsMap = () => {
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getCache, setCache, isCacheValid } = useCache(); // Access cache functions

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

    const cacheKey = `asteroids_map_${startDate}_${endDate}`; // Unique cache key
    const cachedData = getCache(cacheKey);

    // Validate cached data
    if (isCacheValid(cacheKey) && cachedData && cachedData.near_earth_objects) {
      const asteroidList = Object.keys(cachedData.near_earth_objects).flatMap(date =>
        cachedData.near_earth_objects[date].map(asteroid => ({
          id: asteroid.id,
          name: asteroid.name,
          missDistance: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical),
          hazardous: asteroid.is_potentially_hazardous_asteroid,
          // Simulated lat/lng for visualization (NASA API doesn't provide this)
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
        }))
      );
      setAsteroids(asteroidList);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/neo/feed?start_date=${startDate}&end_date=${endDate}`);
      const data = response.data;
      // Validate API response
      if (data && data.near_earth_objects) {
        setCache(cacheKey, data, 300000); // 5-minute TTL
        const asteroidList = Object.keys(data.near_earth_objects).flatMap(date =>
          data.near_earth_objects[date].map(asteroid => ({
            id: asteroid.id,
            name: asteroid.name,
            missDistance: parseFloat(asteroid.close_approach_data[0]?.miss_distance.astronomical),
            hazardous: asteroid.is_potentially_hazardous_asteroid,
            // Simulated lat/lng for visualization (NASA API doesn't provide this)
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180,
          }))
        );
        setAsteroids(asteroidList);
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

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Hazardous Asteroids Map</h2>
      <DateForm
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        fetchAsteroids={fetchAsteroids}
        loading={loading}
      />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <div className="mt-6" style={{ height: '500px' }}>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {asteroids.map(asteroid => (
            <CircleMarker
              key={asteroid.id}
              center={[asteroid.lat, asteroid.lng]}
              radius={asteroid.hazardous ? 10 : 5}
              fillColor={asteroid.hazardous ? 'red' : 'blue'}
              color={asteroid.hazardous ? 'red' : 'blue'}
              fillOpacity={0.5}
            >
              <Tooltip>
                <div>
                  <strong>{asteroid.name}</strong><br />
                  Miss Distance: {asteroid.missDistance?.toFixed(4)} AU<br />
                  Hazardous: {asteroid.hazardous ? 'Yes' : 'No'}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default HazardousAsteroidsMap;