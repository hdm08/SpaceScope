import React, { createContext, useContext, useState } from 'react';

// Create Cache Context
const CacheContext = createContext();

// Cache Provider Component
const CacheProvider = ({ children }) => {
  const [cache, setCacheState] = useState({});

  // ✅ FIXED: Properly closed getCache function
  const getCache = (key) => {
    return cache[key] || null;
  };

  // Set cache value with optional TTL (in milliseconds)
  const setCache = (key, value, ttl = null) => {
    setCacheState((prevCache) => ({
      ...prevCache,
      [key]: { data: value, timestamp: Date.now() },
    }));

    if (ttl) {
      setTimeout(() => {
        setCacheState((currentCache) => {
          const { [key]: _, ...rest } = currentCache;
          return rest;
        });
      }, ttl);
    }
  };

  // Clear cache by key or entirely
  const clearCache = (key = null) => {
    if (key) {
      setCacheState((prevCache) => {
        const { [key]: _, ...rest } = prevCache;
        return rest;
      });
    } else {
      setCacheState({});
    }
  };

  // Check if cache entry is valid (not expired)
  const isCacheValid = (key) => {
    const entry = cache[key];
    if (!entry) return false;
    // You can add more logic here to check expiration if needed
    return true;
  };

  const cacheValue = {
    getCache,
    setCache,
    clearCache,
    isCacheValid,
  };

  return (
    <CacheContext.Provider value={cacheValue}>
      {children}
    </CacheContext.Provider>
  );
};

// Custom hook to access cache
const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export { CacheProvider, useCache };
