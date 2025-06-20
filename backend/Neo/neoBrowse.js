const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const NeoBrowse = async (req, res) => {
  const { page = 0, size = 20 } = req.query;
  const cacheKey = `browse_${page}_${size}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      "https://api.nasa.gov/neo/rest/v1/neo/browse", {
        params: {
          "page": page,
          "size": size,
          "api_key": process.env.NASA_API_KEY,
        }
      });
    console.log(response)
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Neo Browse data' });
  }
};

module.exports = NeoBrowse;