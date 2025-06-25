import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    PointElement,
    LineElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useCache } from '../../components/CacheProvider';

// Register required chart.js components for line chart
ChartJS.register(PointElement, LineElement, LinearScale, TimeScale, Tooltip, Legend);

const HistoricCloseApproaches = () => {
    const [asteroidId, setAsteroidId] = useState('3542519');
    const [asteroid, setAsteroid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('5years'); // Default to Last 5 Years

    const { getCache, setCache, isCacheValid } = useCache();

    const fetchAsteroid = async () => {
        if (!asteroidId) {
            setError('Please enter a valid asteroid ID.');
            setLoading(false);
            return;
        }

        const cacheKey = `asteroid_lookup_${asteroidId}`;
        const cachedData = getCache(cacheKey);

        if (isCacheValid(cacheKey) && cachedData && cachedData.id) {
            setAsteroid(cachedData);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:4000/api/neo/lookup/${asteroidId}`);
            const data = response.data;
            if (data && data.id) {
                setCache(cacheKey, data, 600000);
                setAsteroid(data);
            } else {
                setAsteroid(null);
                setError('Invalid asteroid data received from API.');
            }
        } catch (err) {
            setAsteroid(null);
            setError('Failed to fetch asteroid data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (asteroidId) {
            fetchAsteroid();
        }
    }, [asteroidId]);

    // Define time range filter based on selected tab
    const getTimeFilter = (approach) => {
        const approachDate = dayjs(approach.close_approach_date_full);
        const currentDate = dayjs();
        switch (timeRange) {
            case '5years':
                return approachDate.isAfter(currentDate.subtract(5, 'year')) && approachDate.isBefore(currentDate);
            case '10years':
                return approachDate.isAfter(currentDate.subtract(10, 'year')) && approachDate.isBefore(currentDate);
            case '50years':
                return approachDate.isAfter(currentDate.subtract(50, 'year')) && approachDate.isBefore(currentDate);
            case 'all':
                return approachDate.isBefore(currentDate); // No lower bound for All Time
            default:
                return false;
        }
    };

    const chartData = {
        datasets: [
            {
                label: 'Miss Distance (AU)',
                data:
                    asteroid?.close_approach_data
                        ?.filter(getTimeFilter)
                        ?.sort((a, b) => dayjs(a.close_approach_date_full).valueOf() - dayjs(b.close_approach_date_full).valueOf())
                        ?.map((approach) => ({
                            x: dayjs(approach.close_approach_date_full).valueOf(),
                            y: parseFloat(approach.miss_distance?.astronomical),
                        })) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 0.8)',
                fill: false,
                pointRadius: 4,
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'year',
                },
                title: {
                    display: true,
                    text: 'Close Approach Date',
                    color: 'white',
                },
                ticks: {
                    color: 'white',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: timeRange === 'all' ? 15 : 10, // Adjust ticks for All Time
                },
                grid: { color: '#444' },
            },
            y: {
                title: {
                    display: true,
                    text: 'Miss Distance (AU)',
                    color: 'white',
                },
                beginAtZero: true,
                ticks: { color: 'white' },
                grid: { color: '#444' },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => [
                        `Date: ${dayjs(context.raw.x).format('YYYY-MM-DD HH:mm')}`,
                        `Distance: ${context.raw.y?.toFixed(4)} AU`,
                    ],
                },
            },
            legend: {
                labels: {
                    color: 'white',
                },
            },
        },
    };

    return (
        <div className="max-w-4xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 flex justify-center">Historic Close Approaches</h2>
            <div className="flex items-end gap-4 mb-6 justify-center">
                <input
                    type="text"
                    value={asteroidId}
                    placeholder="Asteroid ID"
                    onChange={(e) => setAsteroidId(e.target.value)}
                    className="w-72 p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchAsteroid}
                    className="h-11 w-72 px-5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch Asteroid'}
                </button>
            </div>
            <div className="flex justify-center gap-2 mb-6">
                {[
                    { label: 'Last 5 Years', value: '5years' },
                    { label: 'Last 10 Years', value: '10years' },
                    { label: 'Last 50 Years', value: '50years' },
                    { label: 'All Time', value: 'all' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setTimeRange(tab.value)}
                        className={`px-4 py-2 rounded-md font-semibold transition ${
                            timeRange === tab.value
                                ? 'bg-indigo-700 text-white'
                                : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {asteroid ? (
                chartData.datasets[0].data.length > 0 ? (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">{asteroid.name}</h3>
                        <Chart type="line" data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <p className="text-center mt-4">No close approaches in the selected time range.</p>
                )
            ) : (
                !loading && <p className="text-center mt-4">No asteroid data available.</p>
            )}
        </div>
    );
};

export default HistoricCloseApproaches;