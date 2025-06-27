const axios = require('axios');

const NeoLookup = async (req, res) => {
  const { asteroidId } = req.params;

  try {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}`,
      {
        params: {
          api_key: process.env.NASA_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('NASA API fetch error:', error.response?.data || error.message); 
    res.status(500).json({ error: 'Failed to fetch Neo Lookup data' });
  }
};

module.exports = NeoLookup;
