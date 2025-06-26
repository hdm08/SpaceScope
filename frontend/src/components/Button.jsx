import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../context/firebase';

const Button = ({ item, page, favorites, setFavorites }) => {
  const { user } = useAuth();
  const isApodPage = page === 'Home' || page === 'Archive';
  const isSearchPage = page === 'Search';
  const favoritesField = isApodPage ? 'apodFavorites' : 'mediaFavorites';
  const idField = isApodPage ? 'date' : 'data[0].nasa_id';

  const addFavorite = async () => {
    if (!user) {
      toast.error('Please login first!');
      return;
    }

    if (!item || (isSearchPage && (!item.data || !item.data[0]?.nasa_id))) {
      console.error('Invalid item:', item);
      toast.error('Cannot add to favorites: Invalid item data');
      return;
    }

    try {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(userFavoritesRef);
      const existingFavorites = docSnap.exists() ? docSnap.data()[favoritesField] || [] : [];

      const itemId = isApodPage ? item.date : item.data[0].nasa_id;
      if (existingFavorites.some(fav => fav[idField] === itemId)) {
        toast.error('Already in favorites');
        return;
      }

      if (!docSnap.exists()) {
        await setDoc(userFavoritesRef, { [favoritesField]: [item] });
      } else {
        await updateDoc(userFavoritesRef, {
          [favoritesField]: arrayUnion(item)
        });
      }
      if (typeof setFavorites === 'function') {
        setFavorites(prev => [...prev, item]);
      } else {
        console.warn('setFavorites is not a function. Favorites state not updated locally.');
      }
      toast.success('Added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFavorite = async (id) => {
    if (!id) {
      console.error('Invalid ID for removal:', id);
      toast.error('Cannot remove from favorites: Invalid ID');
      return;
    }

    console.log('Removing favorite:', { id, favoritesField, favorites });

    try {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      const itemToRemove = favorites.find(fav => {
        const favId = isApodPage ? fav.date : fav?.data?.[0]?.nasa_id;
        return favId === id;
      });

      if (!itemToRemove) {
        console.error('Item to remove not found in favorites:', { id, favorites });
        toast.error('Item not found in favorites');
        return;
      }

      console.log('Item to remove:', itemToRemove);

      await updateDoc(userFavoritesRef, {
        [favoritesField]: arrayRemove(itemToRemove)
      });

      if (typeof setFavorites === 'function') {
        const updatedFavorites = favorites.filter(fav => {
          const favId = isApodPage ? fav.date : fav?.data?.[0]?.nasa_id;
          return favId !== id;
        });
        setFavorites(updatedFavorites);
      } else {
        console.warn('setFavorites is not a function. Favorites state not updated locally.');
      }
      toast.success('Removed from Favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error(`Failed to remove from favorites: ${error.message}`);
    }
  };

  return (
    <div className="mt-4 flex justify-center space-x-4">
      {(isApodPage || isSearchPage) ? (
        <button
          onClick={addFavorite}
          className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Add to Favorites
        </button>
      ) : (
        <button
          onClick={() => {
            const id = isApodPage ? item?.date : item?.data?.[0]?.nasa_id;
            console.log('Triggering removeFavorite with id:', id);
            removeFavorite(id);
          }}
          className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Remove from Favorites
        </button>
      )}
      
      <button
        onClick={() => {
          const url = isApodPage ? item?.url : item?.links?.find(link => link.rel === 'preview')?.href || item?.data?.[0]?.href;
          const title = isApodPage ? item?.title : item?.data?.[0]?.title || 'NASA Media';
          if (!url || !title) {
            toast.error('Cannot share: Invalid item data');
            return;
          }
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
          window.open(twitterUrl, '_blank', 'noopener,noreferrer');
        }}
        className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
      >
        Share on Twitter
      </button>

      <button
        onClick={() => {
          const url = isApodPage ? item?.url : item?.links?.find(link => link.rel === 'preview')?.href || item?.data?.[0]?.href;
          if (!url) {
            toast.error('Cannot share: Invalid item data');
            return;
          }
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
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