const axios = require('axios');


const NeoBrowse = async (req, res) => {
  const { page = 0, size = 20 } = req.query;

  try {
    const response = await axios.get(
      "https://api.nasa.gov/neo/rest/v1/neo/browse", {
        params: {
          "page": page,
          "size": size,
          "api_key": process.env.NASA_API_KEY,
        }
      });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Neo Browse data' });
  }
};

module.exports = NeoBrowse;