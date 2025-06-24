import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [selectedApod, setSelectedApod] = useState(null);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (date) => {
        const updatedFavorites = favorites.filter((apod) => apod.date !== date);
        setFavorites(updatedFavorites);
        toast.success('Removed from Favorites ');
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Favorite APODs</h1>
            {favorites.length === 0 && <p className="text-center">No favorites yet!</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favorites.map((apod) => (
                    <motion.div
                        key={apod.date}
                        className="bg-transparent rounded-lg shadow-lg p-4 flex flex-col cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img
                            src={apod.media_type === 'image' ? apod.url : apod.thumbnail_url}
                            alt={apod.title}
                            className="w-full h-48 object-cover rounded"
                            onClick={() => setSelectedApod(apod)}
                        />

                        <h2 className="text-lg font-semibold mt-2 truncate">{apod.title}</h2>
                        <p className="text-sm text-white">{apod.date}</p>
                        <button
                            onClick={() => removeFavorite(apod.date)}
                            className="mt-auto bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </motion.div>
                ))}
            </div>
            {selectedApod && (
                <Modal
                    onClose={() => setSelectedApod(null)}
                    item={selectedApod}
                    page="Favorites"
                    favorites={favorites}
                    setFavorites={setFavorites}
                >
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

export default FavoritesPage;