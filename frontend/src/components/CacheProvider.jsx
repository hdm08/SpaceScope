import React, { createContext, useContext, useState } from 'react';

const CacheContext = createContext();

const CacheProvider = ({ children }) => {
  const [cache, setCacheState] = useState({});

  const getCache = (key) => {
    return cache[key] || null;
  };

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

  const isCacheValid = (key) => {
    const entry = cache[key];
    if (!entry) return false;
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

const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export { CacheProvider, useCache };
