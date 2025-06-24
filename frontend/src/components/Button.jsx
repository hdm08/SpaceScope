import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Button = ({ apod, page, favorites, setFavorites }) => {
  const { user } = useAuth(); // Get user from AuthContext

  const removeFavorite = (date) => {
    const updatedFavorites = favorites.filter((apod) => apod.date !== date);
    setFavorites(updatedFavorites);
    toast.success('Removed from Favorites');
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addFavorite = () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login first!');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.some((fav) => fav.date === apod.date)) {
      favorites.push(apod);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast.success('Added to favorites!');
    } else {
      toast.error('Already in favorites');
    }
  };

  return (
    <div className="mt-4 flex justify-center space-x-4">
      {(page === 'Archive' || page === 'Home') ? (
        <button
          onClick={addFavorite}
          className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Add to Favorites
        </button>
      ) : (
        <button
          onClick={() => removeFavorite(apod.date)}
          className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Remove from Favorites
        </button>
      )}
      
      <button
        onClick={() => {
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(apod.title)}&url=${encodeURIComponent(apod.url)}`;
          window.open(twitterUrl, '_blank', 'noopener,noreferrer');
        }}
        className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
      >
        Share on Twitter
      </button>

      <button
        onClick={() => {
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(apod.url)}`;
          window.open(facebookUrl, '_blank', 'noopener,noreferrer');
        }}
        className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
      >
        Share on Facebook
      </button>
    </div>
  );
};

export default Button;