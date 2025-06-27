import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Range } from 'react-range';
import { Video } from 'lucide-react';
import debounce from 'lodash/debounce';
import { useCache } from '../components/CacheProvider';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../context/firebase';
import {VITE_BASE_BE_API_URL} from "../components/api"

const MIN = 1960;
const MAX = 2025;

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trendingPhotos, setTrendingPhotos] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [yearRange, setYearRange] = useState([1960, 2025]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaFavorites, setMediaFavorites] = useState([]);
  const { getCache, setCache, isCacheValid } = useCache();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setMediaFavorites([]);
      return;
    }

    const userFavoritesRef = doc(db, 'favorites', user.uid);
    const unsubscribe = onSnapshot(userFavoritesRef, (docSnap) => {
      if (docSnap.exists()) {
        setMediaFavorites(docSnap.data().mediaFavorites || []);
      } else {
        setMediaFavorites([]);
      }
    }, (error) => {
      console.error('Error fetching media favorites:', error);
      toast.error('Failed to load media favorites');
    });

    return () => unsubscribe();
  }, [user]);

  const fetchTrending = async () => {
    const cacheKey = `search:trending:${new Date().getFullYear()}`;
    if (isCacheValid(cacheKey)) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setTrendingPhotos(cachedData.data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${VITE_BASE_BE_API_URL}/search`, {
        params: {
          year_start: new Date().getFullYear() - 1,
          year_end: new Date().getFullYear(),
        },
      });
      console.log('Trending Response:', response.data.length, response.data.slice(0, 2));
      setTrendingPhotos(response.data.filter(item => item?.data?.[0]?.nasa_id) || []);
      setCache(cacheKey, response.data);
    } catch (err) {
      console.error('Error fetching trending data:', err.response?.data || err.message);
      setError('Failed to fetch trending photos. Please check your connection or try again later.');
      toast.error('Failed to fetch trending photos');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const cacheKey = `search:${query}:${mediaType || 'all'}:${yearRange.join('-')}`;
    if (isCacheValid(cacheKey)) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setResults(cachedData.data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${VITE_BASE_BE_API_URL}/search`, {
        params: {
          q: query,
          media_type: mediaType || undefined,
          year_start: yearRange[0],
          year_end: yearRange[1],
        },
      });
      console.log('Search Response:', response.data.length, response.data.slice(0, 2));
      setResults(response.data.filter(item => item?.data?.[0]?.nasa_id) || []);
      setCache(cacheKey, response.data);
    } catch (err) {
      console.error('Error fetching search data:', err.response?.data || err.message);
      setError(`Failed to fetch search results for "${query}". Please try again.`);
      toast.error(`Failed to fetch results for "${query}"`);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);

  useEffect(() => {
    if (!query.trim()) {
      fetchTrending();
      setResults([]);
    } else {
      debouncedFetchData();
    }
    return () => debouncedFetchData.cancel();
  }, [query, mediaType, yearRange]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchData();
  };

  const getPreviewUrl = (item) => {
    if (!item?.links) return 'https://via.placeholder.com/150';
    const preview = item.links.find((link) => link.rel === 'preview');
    return preview?.href || 'https://via.placeholder.com/150';
  };

  const getFullUrl = (item) => {
    if (!item?.links) return 'https://via.placeholder.com/150';
    const preview = item.links.find((link) => link.rel === 'preview');
    if (preview?.href) return preview.href;
    const mediaLink = item.links.find((link) =>
      link.href?.endsWith('.mp4') || link.href?.endsWith('.mp3') || link.href?.endsWith('.wav')
    );
    return mediaLink?.href || 'https://via.placeholder.com/150';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full flex justify-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NASA media..."
              className="p-4 border rounded bg-transparent w-4/5 max-w-4xl text-lg"
            />
          </div>
        </form>
      </div>

      {query.trim() && results.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-center mt-4">
            <div className="inline-flex gap-4 justify-center rounded-full bg-transparent p-1">
              {['', 'image', 'video', 'audio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMediaType(type)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    mediaType === type ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-blue-100'
                  }`}
                >
                  {type === '' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center w-full mt-4">
            <label className="mb-2 text-center text-white">
              Year Range: {yearRange[0]} - {yearRange[1]}
            </label>
            <div className="w-full max-w-md flex justify-center">
              <Range
                step={1}
                min={MIN}
                max={MAX}
                values={yearRange}
                onChange={(values) => setYearRange(values)}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-2 bg-gray-300 rounded w-full" style={{ ...props.style }}>
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div {...props} className="w-5 h-5 rounded-full bg-blue-500 shadow" />
                )}
              />
            </div>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : !query.trim() ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-white text-center">Trending NASA Photos</h2>
          {trendingPhotos.length === 0 ? (
            <p className="text-white text-center">No trending photos found for the selected years.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingPhotos.map((item, index) => (
                item?.data?.[0]?.nasa_id && (
                  <div
                    key={item.data[0].nasa_id}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={getPreviewUrl(item)}
                      alt={item.data[0]?.title || 'NASA Media'}
                      className="w-full h-48 object-cover rounded"
                    />
                    {item.data[0]?.media_type === 'video' && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full">
                        <Video className="text-white w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white p-4 rounded">
                      <div>
                        <h3 className="text-lg font-bold">{item.data[0]?.title || 'Untitled'}</h3>
                        <p>
                          {item.data[0]?.date_created
                            ? new Date(item.data[0].date_created).toLocaleDateString()
                            : 'N/A'}
                        </p>
                        <p>{item.data[0]?.description?.substring(0, 100) || 'No description'}...</p>
                      </div>
                    </div>
                    
                  </div>
                )
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length === 0 ? (
            <p className="text-white text-center col-span-full">No search results found for "{query}".</p>
          ) : (
            results.map((item, index) => (
              item?.data?.[0]?.nasa_id && (
                <div
                  key={item.data[0].nasa_id}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={getPreviewUrl(item)}
                    alt={item.data[0]?.title || 'NASA Media'}
                    className="w-full h-48 object-cover rounded"
                  />
                  {item.data[0]?.media_type === 'video' && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full">
                      <Video className="text-white w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white p-4 rounded">
                    <div>
                      <h3 className="text-lg font-bold">{item.data[0]?.title || 'Untitled'}</h3>
                      <p>
                        {item.data[0]?.date_created
                          ? new Date(item.data[0].date_created).toLocaleDateString()
                          : 'N/A'}
                      </p>
                      <p>{item.data[0]?.description?.substring(0, 100) || 'No description'}...</p>
                    </div>
                  </div>
                  
                </div>
              )
            ))
          )}
        </div>
      )}

      {selectedItem && selectedItem?.data?.[0]?.nasa_id && (
        <Modal onClose={() => setSelectedItem(null)} item={selectedItem} page="Search">
          <h2 className="text-2xl font-bold mb-2">{selectedItem.data[0]?.title || 'Untitled'}</h2>
          {selectedItem.data[0]?.media_type === 'image' && (
            <img
              src={getFullUrl(selectedItem)}
              alt={selectedItem.data[0]?.title || 'NASA Media'}
              className="w-full max-h-96 object-contain mb-4"
            />
          )}
          {selectedItem.data[0]?.media_type === 'video' && (
            <div>
              <video controls className="w-full max-h-96 mb-4">
                <source src={getFullUrl(selectedItem)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <a
                href={getFullUrl(selectedItem)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline text-sm"
              >
                Open video in new tab
              </a>
            </div>
          )}
          {selectedItem.data[0]?.media_type === 'audio' && (
            <div>
              <audio controls className="w-full mb-4">
                <source src={getFullUrl(selectedItem)} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a
                href={getFullUrl(selectedItem)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline text-sm"
              >
                Open audio in new tab
              </a>
            </div>
          )}
          <p>
            <strong>Date:</strong>{' '}
            {selectedItem.data[0]?.date_created
              ? new Date(selectedItem.data[0].date_created).toLocaleDateString()
              : 'N/A'}
          </p>
          <p><strong>Center:</strong> {selectedItem.data[0]?.center || 'N/A'}</p>
          <p><strong>Description:</strong> {selectedItem.data[0]?.description || 'No description available'}</p>
          <p><strong>Keywords:</strong> {selectedItem.data[0]?.keywords?.join(', ') || 'None'}</p>
          <p><strong>NASA ID:</strong> {selectedItem.data[0]?.nasa_id || 'N/A'}</p>
          {selectedItem.data[0]?.secondary_creator && (
            <p><strong>Secondary Creator:</strong> {selectedItem.data[0]?.secondary_creator}</p>
          )}
          <Button
            item={selectedItem}
            page="Search"
            favorites={mediaFavorites}
            setFavorites={setMediaFavorites}
          />
        </Modal>
      )}
    </div>
  );
};

export default Search;