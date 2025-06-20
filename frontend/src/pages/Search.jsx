import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';             // your existing modal component
import LoadingSpinner from '../components/LoadingSpinner'; // your existing spinner component
import ErrorMessage from '../components/ErrorMessage';     // your existing error message component
import { Range } from 'react-range';
import { Video } from 'lucide-react';

const MIN = 1960;
const MAX = 2025;

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [mediaType, setMediaType] = useState('');
    const [yearRange, setYearRange] = useState([1960, 2025]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!query) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/search', {
                params: {
                    q: query,
                    media_type: mediaType,
                    year_start: yearRange[0],
                    year_end: yearRange[1],
                },
            });
            setResults(response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) fetchData();
    }, [query, mediaType, yearRange]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const getPreviewUrl = (item) => {
        const links = item.links || [];
        const preview = links.find(link => link.rel === 'preview' || link.rel === 'alternate');
        return preview?.href || '';
    };

    const getFullUrl = (item) => {
        const links = item.links || [];

        // For images or general fallback
        const preview = links.find(link => link.rel === 'preview' || link.rel === 'alternate');
        console.log('1Item Links:', preview.href);
        if (preview?.href) return preview.href;


        // Sometimes `href` has ".mp4" or ".mp3"
        const mediaLink = links.find(link =>
            link.href?.endsWith('.mp4') || link.href?.endsWith('.mp3') || link.href?.endsWith('.wav')
        );
        console.log('2Item Links:', mediaLink.href);

        if (mediaLink?.href) return mediaLink.href;

        return '';
    };


    return (
        <div className="container mx-auto p-4">
            {/* Search and Filter Section */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full flex justify-center ">
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

            {query.trim() && (
                <>
                    <div className="mb-8">

                        {results.length > 0 && (
                            <>
                                {/* Media Type Buttons */}
                                <div className="flex justify-center mt-4">
                                    <div className="inline-flex gap-4 justify-center rounded-full bg-transparent p-1">
                                        {['', 'image', 'video', 'audio'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setMediaType(type)}
                                                className={`px-4 py-2 rounded-full transition-all duration-300 ${mediaType === type
                                                    ? 'bg-white text-black'
                                                    : 'bg-transparent text-white hover:bg-blue-100'
                                                    }`}
                                            >
                                                {type === '' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Year Range Slider */}
                                <div className="flex flex-col items-center w-full mt-4">
                                    <label className="mb-2 text-center">
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
                                                <div
                                                    {...props}
                                                    className="h-2 bg-gray-300 rounded w-full"
                                                    style={{ ...props.style }}
                                                >
                                                    {children}
                                                </div>
                                            )}
                                            renderThumb={({ props }) => (
                                                <div
                                                    {...props}
                                                    className="w-5 h-5 rounded-full bg-blue-500 shadow"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                    {/* </div> */}

                    {/* Error Message */}
                    {error && <ErrorMessage message={error} />}

                    {/* Results Grid or Loading Spinner */}
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative group cursor-pointer"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    {/* Preview Image */}
                                    <img
                                        src={getPreviewUrl(item)}
                                        alt={item.data[0]?.title || 'NASA Media'}
                                        className="w-full h-48 object-cover rounded"
                                    />

                                    {/* Video Icon Overlay */}
                                    {item.data[0]?.media_type === 'video' && (
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full">
                                            <Video className="text-white w-6 h-6" />
                                        </div>
                                    )}

                                    {/* Hover Details */}
                                    <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white p-4 rounded">
                                        <div>
                                            <h3 className="text-lg font-bold">{item.data[0]?.title}</h3>
                                            <p>{new Date(item.data[0]?.date_created).toLocaleDateString()}</p>
                                            <p>{item.data[0]?.description?.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Detailed View Modal */}
            {selectedItem && (
                <Modal onClose={() => setSelectedItem(null)}>
                    <div className="max-w-3xl max-h-[80vh] overflow-y-auto p-6 bg-black bg-opacity-80 text-white rounded shadow-lg relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-3 right-3 text-white hover:text-white-300 text-2xl font-bold"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-2">{selectedItem.data[0]?.title}</h2>
                        {selectedItem.data[0]?.media_type === 'image' && (
                            <img
                                src={getFullUrl(selectedItem)}
                                alt={selectedItem.data[0]?.title}
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
                        <p><strong>Date:</strong> {new Date(selectedItem.data[0]?.date_created).toLocaleDateString()}</p>
                        <p><strong>Center:</strong> {selectedItem.data[0]?.center}</p>
                        <p><strong>Description:</strong> {selectedItem.data[0]?.description}</p>
                        <p><strong>Keywords:</strong> {selectedItem.data[0]?.keywords?.join(', ')}</p>
                        <p><strong>NASA ID:</strong> {selectedItem.data[0]?.nasa_id}</p>
                        {selectedItem.data[0]?.secondary_creator && (
                            <p><strong>Secondary Creator:</strong> {selectedItem.data[0]?.secondary_creator}</p>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Search;
