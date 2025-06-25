import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import {db} from '../context/firebase'
const Button = ({ apod, page, favorites, setFavorites }) => {
  const { user } = useAuth();

  const addFavorite = async () => {
    if (!user) {
      toast.error('Please login first!');
      return;
    }

    try {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(userFavoritesRef);
      const existingFavorites = docSnap.exists() ? docSnap.data().favorites || [] : [];

      if (existingFavorites.some(fav => fav.date === apod.date)) {
        toast.error('Already in favorites');
        return;
      }

      if (!docSnap.exists()) {
        await setDoc(userFavoritesRef, { favorites: [apod] });
      } else {
        await updateDoc(userFavoritesRef, {
          favorites: arrayUnion(apod)
        });
      }
      if (typeof setFavorites === 'function') {
        setFavorites(prev => [...prev, apod]);
      } else {
        console.warn('setFavorites is not a function. Favorites state not updated locally.');
      }
      toast.success('Added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFavorite = async (date) => {
    try {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      const apodToRemove = favorites.find(fav => fav.date === date);
      if (apodToRemove) {
        await updateDoc(userFavoritesRef, {
          favorites: arrayRemove(apodToRemove)
        });
        if (typeof setFavorites === 'function') {
          const updatedFavorites = favorites.filter(fav => fav.date !== date);
          setFavorites(updatedFavorites);
        } else {
          console.warn('setFavorites is not a function. Favorites state not updated locally.');
        }
        toast.success('Removed from Favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
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