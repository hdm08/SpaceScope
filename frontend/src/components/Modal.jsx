import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const Modal = ({ onClose, children, item, page, favorites, setFavorites }) => {
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

          {/* Modal Content */}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;