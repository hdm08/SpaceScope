import React from 'react';

const DateForm = ({ startDate, setStartDate, endDate, setEndDate, fetchAsteroids, loading }) => {
  return (
    <div className="flex justify-center">
    <div className="flex flex-col sm:flex-row sm:items-end flex-wrap gap-4 mb-6">
      <div className="flex flex-col w-full sm:w-48">
        <label className="text-sm font-medium text-white mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col w-full sm:w-48">
        <label className="text-sm font-medium text-white mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={fetchAsteroids}
        disabled={loading}
        className="h-11 w-full sm:w-48 px-5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition"
      >
        {loading ? 'Loading...' : 'Fetch'}
      </button>
    </div>
    </div>
  );
};

export default DateForm;
