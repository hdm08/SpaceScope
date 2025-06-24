import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';


const AsteroidExplorerDashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/neo/browse', {
        params: { page: page, size: 20 },
      });
      setAsteroids(response.data.near_earth_objects);
      setTotalPages(response.data.page.total_pages);
    } catch (err) {
      setError('Failed to fetch asteroid data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAsteroidDetails = async (asteroidId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/neo/lookup/${asteroidId}`);
      setSelectedAsteroid(response.data);
      setModalOpen(true);
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
      <h2 className="text-2xl font-bold mb-4">Asteroid Explorer Dashboard</h2>

      <div className="mb-4">
          <input
            type="text"
            placeholder="Search asteroid by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
        </div>
      ) : asteroids.length === 0 ? (
        <p className="text-center text-white">No asteroids found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {asteroids
  .filter((asteroid) =>
    searchTerm.trim() === '' ? true : asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {(
          (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
            asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
          2
        ).toFixed(2)}{' '}
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

      {selectedAsteroid && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedAsteroid.name}>
          <div className="max-w-3xl max-h-[80vh] overflow-y-auto p-6 bg-black bg-opacity-80 text-white rounded shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedAsteroid(null)}
              className="absolute top-3 right-3 text-white hover:text-white-300 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
          <p className="mb-2">ID: {selectedAsteroid.id}</p>
          <p className="mb-2">
            Diameter:{' '}
            {(
              (selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min +
                selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max) /
              2
            ).toFixed(2)}{' '}
            km
          </p>
          <p className="mb-2">
            Hazardous: {selectedAsteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
          </p>
          <p className="font-semibold mt-4">Close Approaches:</p>
          <ul className="list-disc pl-5">
            {selectedAsteroid.close_approach_data.map((approach, index) => (
              <li key={index}>
                Date: {approach.close_approach_date_full}, Distance:{' '}
                {parseFloat(approach.miss_distance.astronomical).toFixed(4)} AU
              </li>
            ))}
          </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AsteroidExplorerDashboard;