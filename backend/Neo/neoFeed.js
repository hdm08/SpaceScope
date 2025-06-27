const axios = require('axios');


const NeoFeed = async (req, res) => {
  const { SD, ED } = req.query;
   
  try {
    const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
      params: {
        "start_date": SD,
        "end_date": ED,
        "api_key": process.env.NASA_API_KEY,
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
module.exports = NeoFeed;