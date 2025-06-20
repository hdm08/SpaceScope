import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const HazardousAsteroidsMap = () => {
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-07');
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/neo/feed?start_date=${startDate}&end_date=${endDate}`);
      const nearEarthObjects = response.data.near_earth_objects;
      const asteroidList = Object.keys(nearEarthObjects).flatMap(date =>
        nearEarthObjects[date].map(asteroid => ({
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
    } catch (err) {
      setError('Failed to fetch asteroid data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Hazardous Asteroids Map</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="mt-1 block w-full border-white  bg-transparent text-white  rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mt-1 block w-full border-white  bg-transparent text-white  rounded-md shadow-sm"
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
                  Miss Distance: {asteroid.missDistance.toFixed(4)} AU<br />
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