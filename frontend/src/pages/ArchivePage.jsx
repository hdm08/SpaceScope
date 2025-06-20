import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

import '../styles/masonry.css';
const ArchivePage = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [apods, setApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApod, setSelectedApod] = useState(null);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        setLoading(true);
        const sd = `${year}-${month.padStart(2, '0')}-01`; //  month prefix 2 -> 02
        // months are zero based index[Jan, Feb..Dec] Date(2025, 6, 0) = 2025/07/01 -1 = 2025/06/30
        let ed = new Date(year, month, 0).toISOString().split('T')[0]; // Default: last day of the month

        const today = new Date();
        const cur_year = today.getFullYear();
        const cur_month = String(today.getMonth() + 1).padStart(2, '0');
        const selected_month = String(month).padStart(2, '0');

        if (cur_year == year && cur_month === selected_month) {
          ed = today.toISOString().split('T')[0];
        }

        const response = await axios.get('http://localhost:4000/api/apod/range', {
          params: { startDate: sd, endDate: ed, },
        });
        setApods(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch archive. Please try again.');
        setLoading(false);
      }
    };
    fetchArchive();
  }, [year, month]);

  const handleMonthChange = (e) => {
    const [newYear, newMonth] = e.target.value.split('-');
    navigate(`/archive/${newYear}/${newMonth}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (

    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">APOD Archive</h1>
      <div className="w-full flex justify-center mb-6">
        <input
          type="month"
          onChange={handleMonthChange}
          value={`${year}-${month.padStart(2, '0')}`}
          className="p-2 border rounded bg-transparent text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {[...apods]  // Create a shallow copy to avoid mutating state
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
          .map((apod) => (
            <motion.div
              key={apod.date}
              className="bg-transparent text-white rounded-lg shadow p-4 cursor-pointer"

              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedApod(apod)}>
              <img
                src={apod.media_type === 'image' ? apod.url : apod.thumbnail_url}
                alt={apod.title}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{apod.title}</h2>
              <p className="text-sm text-white">{apod.date}</p>
            </motion.div>
          ))}
      </div>

      {selectedApod && (
        <Modal onClose={() => setSelectedApod(null)}>
          <div className="max-w-3xl max-h-[80vh] overflow-y-auto p-6 bg-black bg-opacity-80 text-white rounded shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedApod(null)}
              className="absolute top-3 right-3 text-white hover:text-white-300 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4">{selectedApod.title}</h2>

            {/* Image or Video */}
            {selectedApod.media_type === 'image' ? (
              <div className="flex justify-center">
                <img
                  src={selectedApod.hdurl || selectedApod.url}
                  alt={selectedApod.title}
                  className="w-[300px] h-[300px] rounded"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <iframe
                  src={selectedApod.url}
                  title={selectedApod.title}
                  className="w-[50px] h-[50px] rounded"
                  allowFullScreen
                />
              </div>
            )}

            <Toaster position="top-right" />

            {/* Description */}
            <p className="mt-4 text-justify">{selectedApod.explanation}</p>

            {/* Add to Favorites Button */}
            <button
              onClick={() => {
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                if (!favorites.some((fav) => fav.date === selectedApod.date)) {
                  favorites.push(selectedApod);
                  localStorage.setItem('favorites', JSON.stringify(favorites));
                  toast.success('Added to favorites!');
                }
                else {
                  toast('Already in favorites');
                }
              }}
              className="mt-4 bg-black text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Add to Favorites
            </button>
          </div>
        </Modal>


      )}
    </div>
  );
};

export default ArchivePage;