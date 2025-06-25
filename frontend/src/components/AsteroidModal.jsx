import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const AsteroidModal = ({ open, onClose, asteroid }) => {
  if (!open || !asteroid) return null;

  // Split close approaches into past and future
  const pastApproaches = asteroid.close_approach_data
    ?.filter((approach) =>
      dayjs(approach.close_approach_date_full).isBefore(dayjs()) ||
      dayjs(approach.close_approach_date_full).isSame(dayjs(), 'minute')
    )
    ?.sort((a, b) => dayjs(a.close_approach_date_full).valueOf() - dayjs(b.close_approach_date_full).valueOf()) || [];

  const futureApproaches = asteroid.close_approach_data
    ?.filter((approach) => dayjs(approach.close_approach_date_full).isAfter(dayjs()))
    ?.sort((a, b) => dayjs(a.close_approach_date_full).valueOf() - dayjs(b.close_approach_date_full).valueOf()) || [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 bg-black bg-opacity-80 text-white rounded shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-300 text-2xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Asteroid Details */}
          <h3 className="text-lg font-semibold mb-4">{asteroid.name}</h3>
          <p className="mb-2">ID: {asteroid.id}</p>
          <p className="mb-2">
            Diameter:{' '}
            {asteroid.estimated_diameter?.kilometers
              ? (
                  (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
                    asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
                  2
                ).toFixed(2)
              : 'N/A'}{' '}
            km
          </p>
          <p className="mb-2">
            Hazardous: {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
          </p>

          {/* Past Close Approaches */}
          <p className="font-semibold mt-4">Past Close Approaches:</p>
          {pastApproaches.length > 0 ? (
            <ul className="list-disc pl-5 mb-4">
              {pastApproaches.map((approach, index) => (
                <li key={index}>
                  Date: {approach.close_approach_date_full}, Distance:{' '}
                  {parseFloat(approach.miss_distance?.astronomical).toFixed(4)} AU
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4">No past close approaches available.</p>
          )}

          {/* Future Close Approaches */}
          <p className="font-semibold mt-4">Future Close Approaches:</p>
          {futureApproaches.length > 0 ? (
            <ul className="list-disc pl-5">
              {futureApproaches.map((approach, index) => (
                <li key={index}>
                  Date: {approach.close_approach_date_full}, Distance:{' '}
                  {parseFloat(approach.miss_distance?.astronomical).toFixed(4)} AU
                </li>
              ))}
            </ul>
          ) : (
            <p>No future close approaches available.</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AsteroidModal;