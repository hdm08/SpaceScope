const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const NeoFeed = async (req, res) => {
  const { SD, ED } = req.query;
  // const cacheKey = `feed_${SD}_${ED}`;
  // const cachedData = cache.get(cacheKey);
  console.log(`SD:${SD}, ED ${ED}`);
  // if (cachedData) {
  //   return res.json(cachedData);
  // }
  try {
    const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
      params: {
        "start_date": SD,
        "end_date": ED,
        "api_key": process.env.NASA_API_KEY,
      }
    });

    // console.log('Data:', response.data);
    // cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
module.exports = NeoFeed;