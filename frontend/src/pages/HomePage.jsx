import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { useCache } from '../components/CacheProvider';

const HomePage = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCache, setCache, isCacheValid } = useCache();

  useEffect(() => {
    const fetchAPOD = async () => {
      // Use current date as cache key (e.g., apod:2025-06-24)
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `apod:${today}`;

      // Check cache
      if (isCacheValid(cacheKey)) {
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          setApod(cachedData.data);
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/apod');
        const data = response.data;
        setApod(data);
        setCache(cacheKey, data); // Cache the response
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch APOD. Please try again later.');
        setLoading(false);
        toast.error('Failed to load APOD');
      }
    };
    fetchAPOD();
  }, [getCache, setCache, isCacheValid]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl text-center font-bold">Astronomy Picture of the Day</h1>
      <p className="text-2xl font-bold text-white text-center mb-4">{apod.date}</p>
      <br />
      <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row gap-6">
        {/* Left Side: Image section */}
        <div className="flex-shrink-0">
          {apod.media_type === 'image' ? (
            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              className="w-[450px] h-[450px] rounded"
            />
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              className="w-[500px] h-[500px] rounded"
              allowFullScreen
            />
          )}
        </div>

        {/* Right side: Text content */}
        <div className="flex-grow text-white">
          <h1 className="text-xl font-bold mb-2">{apod.title}</h1>
          <br />
          <p className="text-justify">{apod.explanation}</p>
          {apod.copyright && (
            <p className="mt-4 text-sm text-gray-400 italic">© {apod.copyright}</p>
          )}
          <Button apod={apod} page="Home" />
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;