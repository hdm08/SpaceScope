import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/apod');
        setApod(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch APOD. Please try again later.');
        setLoading(false);
        toast.error('Failed to load APOD');
      }
    };
    fetchAPOD();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <h1 className='text-2xl text-center font-bold '>Astronomy Picture of the Day</h1>
      <p className="text-2xl font-bold text-white text-center mb-4">{apod.date}</p>
      <br />
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row gap-6">
        {/* Left side: Image or video */}
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
          <h1 className="text-xl font-bold mb-2">{apod.title}</h1><br />

          <p className="text-justify">{apod.explanation}</p>
          {apod.copyright && (
            <p className="mt-4 text-sm text-gray-400 italic">
              © {apod.copyright}
            </p>
          )}
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => {
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                if (!favorites.some((fav) => fav.date === apod.date)) {
                  favorites.push(apod);
                  localStorage.setItem('favorites', JSON.stringify(favorites));
                  toast.success('Added to favorites!');
                } else {
                  toast.error('Already in favorites');
                }
              }}
              className="bg-black text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Add to Favorites
            </button>

            <button
              onClick={() => {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(apod.title)}&url=${encodeURIComponent(apod.url)}`;
                window.open(twitterUrl, '_blank', 'noopener,noreferrer');
              }}
              className="bg-black text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Share on Twitter
            </button>

            <button
              onClick={() => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(apod.url)}`;
                window.open(facebookUrl, '_blank', 'noopener,noreferrer');
              }}
              className="bg-black text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Share on Facebook
            </button>
          </div>

        
      </div>
    </div>
    </motion.div >
  );
};

export default HomePage;

