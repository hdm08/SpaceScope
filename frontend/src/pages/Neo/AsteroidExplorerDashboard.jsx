import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import AsteroidModal from '../../components/AsteroidModal';
import { useCache } from '../../components/CacheProvider';

const AsteroidExplorerDashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { getCache, setCache, isCacheValid } = useCache();

  const fetchAsteroids = async () => {
    const cacheKey = `asteroids_page_${page}`;
    const cachedData = getCache(cacheKey);

    if (isCacheValid(cacheKey) && cachedData && Array.isArray(cachedData.near_earth_objects)) {
      setAsteroids(cachedData.near_earth_objects);
      setTotalPages(cachedData.page?.total_pages || 1);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/neo/browse', {
        params: { page: page, size: 20 },
      });
      const data = response.data;
      if (data && Array.isArray(data.near_earth_objects)) {
        setCache(cacheKey, data, 300000);
        setAsteroids(data.near_earth_objects);
        setTotalPages(data.page?.total_pages || 1);
      } else {
        setAsteroids([]);
        setError('Invalid data format received from API.');
      }
    } catch (err) {
      setAsteroids([]);
      setError('Failed to fetch asteroid data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAsteroidDetails = async (asteroidId) => {
    const cacheKey = `asteroid_${asteroidId}`;
    const cachedData = getCache(cacheKey);

    if (isCacheValid(cacheKey) && cachedData && cachedData.id) {
      setSelectedAsteroid(cachedData);
      setModalOpen(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/neo/lookup/${asteroidId}`);
      const data = response.data;
      if (data && data.id) {
        setCache(cacheKey, data, 600000);
        setSelectedAsteroid(data);
        setModalOpen(true);
      } else {
        setError('Invalid asteroid details received from API.');
      }
    } catch (err) {
      setError('Failed to fetch asteroid details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Asteroid Explorer Dashboard</h2>
      <div className="flex justify-center">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search asteroid by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96 p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
        </div>
      ) : !Array.isArray(asteroids) || asteroids.length === 0 ? (
        <p className="text-center text-white">No asteroids found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {asteroids
            .filter((asteroid) =>
              searchTerm.trim() === ''
                ? true
                : asteroid.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((asteroid) => (
              <div
                key={asteroid.id}
                className="border p-4 rounded-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => fetchAsteroidDetails(asteroid.id)}
              >
                <h3 className="text-lg font-semibold">{asteroid.name}</h3>
                <p>ID: {asteroid.id}</p>
                <p>
                  Diameter:{' '}
                  {asteroid.estimated_diameter?.kilometers
                    ? (
                        (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
                          asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
                        2
                      ).toFixed(2)
                    : 'N/A'}{' '}
                  km
                </p>
                <p>Hazardous: {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
              </div>
            ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || loading}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages - 1 || loading}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition"
        >
          Next
        </button>
      </div>

      <AsteroidModal open={modalOpen} onClose={() => setModalOpen(false)} asteroid={selectedAsteroid} />
    </div>
  );
};

export default AsteroidExplorerDashboard;