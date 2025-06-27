import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { useCache } from '../components/CacheProvider';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../context/firebase';
import {VITE_BASE_BE_API_URL} from "../components/api"

const HomePage = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apodFavorites, setApodFavorites] = useState([]);
  const { getCache, setCache, isCacheValid } = useCache();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setApodFavorites([]);
    } else {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      const unsubscribe = onSnapshot(userFavoritesRef, (docSnap) => {
        if (docSnap.exists()) {
          setApodFavorites(docSnap.data().apodFavorites || []);
        } else {
          setApodFavorites([]);
        }
      }, (error) => {
        console.error('Error fetching APOD favorites:', error);
        toast.error('Failed to load APOD favorites');
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const fetchAPOD = async () => {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `apod:${today}`;

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
        const response = await axios.get(`${VITE_BASE_BE_API_URL}/apod`);
        const data = response.data;
        setApod(data);
        setCache(cacheKey, data);
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
        <div className="flex-grow text-white">
          <h1 className="text-xl font-bold mb-2">{apod.title}</h1>
          <br />
          <p className="text-justify">{apod.explanation}</p>
          {apod.copyright && (
            <p className="mt-4 text-sm text-gray-400 italic">© {apod.copyright}</p>
          )}
          <Button
            item={apod}
            page="Home"
            favorites={apodFavorites}
            setFavorites={setApodFavorites}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;