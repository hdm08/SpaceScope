import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';
import { useCache } from '../components/CacheProvider';
import '../styles/masonry.css';

const ArchivePage = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [apods, setApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApod, setSelectedApod] = useState(null);
  const { getCache, setCache, isCacheValid } = useCache();

  useEffect(() => {
    const fetchArchive = async () => {
      const cacheKey = `apod:${year}-${month.padStart(2, '0')}`;
      const today = new Date();
      const curYear = today.getFullYear();
      const curMonth = String(today.getMonth() + 1).padStart(2, '0');
      const isCurrentMonth = curYear == year && curMonth === month.padStart(2, '0');

      // Check cache
      if (isCacheValid(cacheKey) && !isCurrentMonth) {
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          setApods(cachedData.data);
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const sd = `${year}-${month.padStart(2, '0')}-01`; // Month prefix 2 -> 02
        let ed = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month

        if (isCurrentMonth) {
          ed = today.toISOString().split('T')[0];
        }

        const response = await axios.get('http://localhost:4000/api/apod/range', {
          params: { startDate: sd, endDate: ed },
        });

        const data = response.data;
        setApods(data);
        if (!isCurrentMonth) {
          setCache(cacheKey, data); // Cache for past months
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch archive. Please try again.');
        setLoading(false);
        toast.error('Failed to fetch archive');
      }
    };
    fetchArchive();
  }, [year, month, getCache, setCache, isCacheValid]);

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
        {[...apods]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((apod) => (
            <motion.div
              key={apod.date}
              className="bg-transparent text-white rounded-lg shadow p-4 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedApod(apod)}
            >
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
        <Modal onClose={() => setSelectedApod(null)} item={selectedApod} page="Archive">
          <h2 className="text-2xl font-bold mb-4">{selectedApod.title}</h2>
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
          <p className="mt-4 text-justify">{selectedApod.explanation}</p>
        </Modal>
      )}
    </div>
  );
};

export default ArchivePage;