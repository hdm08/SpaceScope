const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const NeoLookup = async (req, res) => {
  const { asteroidId } = req.params; // ✅ FIXED
  const cacheKey = `lookup_${asteroidId}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}`,
      {
        params: {
          api_key: process.env.NASA_API_KEY,
        },
      }
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error('NASA API fetch error:', error.response?.data || error.message); // ✅ Add logging
    res.status(500).json({ error: 'Failed to fetch Neo Lookup data' });
  }
};

module.exports = NeoLookup;
