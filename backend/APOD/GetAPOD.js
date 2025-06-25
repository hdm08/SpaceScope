const axios = require('axios');

const GetAPOD = async(req, res) =>{
    try {
        const date  = new Date().toISOString().split('T')[0];
        const response = await axios.get('https://api.nasa.gov/planetary/apod', {
          params: { api_key: process.env.NASA_API_KEY, date, thumbs: true },
        });
        res.json(response.data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch APOD' });
      }
}

module.exports = GetAPOD;