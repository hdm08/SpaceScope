import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from "../context/firebase";
import Button from '../components/Button';

const FavoritesPage = () => {
  const [apodFavorites, setApodFavorites] = useState([]);
  const [mediaFavorites, setMediaFavorites] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('apod');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setApodFavorites([]);
      setMediaFavorites([]);
      return;
    }

    const userFavoritesRef = doc(db, 'favorites', user.uid);
    const unsubscribe = onSnapshot(userFavoritesRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApodFavorites(data.apodFavorites || []);
        setMediaFavorites(data.mediaFavorites || []);
      } else {
        setApodFavorites([]);
        setMediaFavorites([]);
      }
    }, (error) => {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    });

    return () => unsubscribe();
  }, [user]);

  const removeFavorite = async (id, type) => {
    if (!id) {
      console.error('Invalid ID for removal:', id);
      toast.error('Cannot remove from favorites: Invalid ID');
      return;
    }

    console.log('Removing favorite:', { id, type });

    try {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      const favorites = type === 'apod' ? apodFavorites : mediaFavorites;
      const idField = type === 'apod' ? 'date' : 'data[0].nasa_id';
      const itemToRemove = favorites.find(fav => {
        const favId = type === 'apod' ? fav.date : fav?.data?.[0]?.nasa_id;
        return favId === id;
      });

      if (!itemToRemove) {
        console.error('Item to remove not found:', { id, type, favorites });
        toast.error('Item not found in favorites');
        return;
      }

      console.log('Item to remove:', itemToRemove);

      await updateDoc(userFavoritesRef, {
        [type === 'apod' ? 'apodFavorites' : 'mediaFavorites']: arrayRemove(itemToRemove)
      });

      // State is updated via onSnapshot, so no need to call setFavorites here
      toast.success('Removed from Favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error(`Failed to remove from favorites: ${error.message}`);
    }
  };

  const renderFavorites = (favorites, type) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {favorites.length === 0 ? (
        <p className="text-center text-white col-span-full">No {type === 'apod' ? 'APOD' : 'Media'} favorites yet!</p>
      ) : (
        favorites.map((item) => (
          <motion.div
            key={type === 'apod' ? item.date : item.data[0]?.nasa_id}
            className="bg-transparent rounded-lg shadow-lg p-4 flex flex-col cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={type === 'apod' ? (item.media_type === 'image' ? item.url : item.thumbnail_url) : item.links?.find(link => link.rel === 'preview')?.href || 'https://via.placeholder.com/150'}
              alt={type === 'apod' ? item.title : item.data[0]?.title || 'NASA Media'}
              className="w-full h-48 object-cover rounded"
              onClick={() => setSelectedItem({ ...item, type })}
            />
            <h2 className="text-lg font-semibold mt-2 truncate">{type === 'apod' ? item.title : item.data[0]?.title || 'Untitled'}</h2>
            <p className="text-sm text-white">{type === 'apod' ? item.date : item.data[0]?.date_created ? new Date(item.data[0].date_created).toLocaleDateString() : 'N/A'}</p>
            <button
              onClick={() => removeFavorite(type === 'apod' ? item.date : item.data[0]?.nasa_id, type)}
              className="mt-auto bg-red-500 text-white p-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Favorite Items</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab('apod')}
          className={`px-4 py-2 rounded-l ${activeTab === 'apod' ? 'bg-white text-black' : 'bg-transparent text-white border border-white'}`}
        >
        Favorites APOD
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-r ${activeTab === 'media' ? 'bg-white text-black' : 'bg-transparent text-white border border-white'}`}
        >
          Favorites Media 
        </button>
      </div>
      {activeTab === 'apod' ? renderFavorites(apodFavorites, 'apod') : renderFavorites(mediaFavorites, 'media')}
      {selectedItem && (
        <Modal
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          page="Favorites"
          favorites={selectedItem.type === 'apod' ? apodFavorites : mediaFavorites}
          setFavorites={selectedItem.type === 'apod' ? setApodFavorites : setMediaFavorites}
        >
          <h2 className="text-2xl font-bold mb-4">{selectedItem.type === 'apod' ? selectedItem.title : selectedItem.data[0]?.title || 'Untitled'}</h2>
          {selectedItem.type === 'apod' ? (
            selectedItem.media_type === 'image' ? (
              <div className="flex justify-center">
                <img
                  src={selectedItem.hdurl || selectedItem.url}
                  alt={selectedItem.title}
                  className="w-[300px] h-[300px] rounded"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <iframe
                  src={selectedItem.url}
                  title={selectedItem.title}
                  className="w-[500px] h-[500px] rounded"
                  allowFullScreen
                />
              </div>
            )
          ) : (
            <>
              {selectedItem.data[0]?.media_type === 'image' && (
                <img
                  src={selectedItem.links?.find(link => link.rel === 'preview')?.href || 'https://via.placeholder.com/150'}
                  alt={selectedItem.data[0]?.title || 'NASA Media'}
                  className="w-full max-h-96 object-contain mb-4"
                />
              )}
              {selectedItem.data[0]?.media_type === 'video' && (
                <div>
                  <video controls className="w-full max-h-96 mb-4">
                    <source src={selectedItem.links?.find(link => link.rel === 'preview')?.href} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {selectedItem.data[0]?.media_type === 'audio' && (
                <div>
                  <audio controls className="w-full mb-4">
                    <source src={selectedItem.links?.find(link => link.rel === 'preview')?.href} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </>
          )}
          <p className="mt-4 text-justify">{selectedItem.type === 'apod' ? selectedItem.explanation : selectedItem.data[0]?.description || 'No description available'}</p>
          <Button
            item={selectedItem}
            page="Favorites"
            favorites={selectedItem.type === 'apod' ? apodFavorites : mediaFavorites}
            setFavorites={selectedItem.type === 'apod' ? setApodFavorites : setMediaFavorites}
          />
        </Modal>
      )}
    </div>
  );
};

export default FavoritesPage;