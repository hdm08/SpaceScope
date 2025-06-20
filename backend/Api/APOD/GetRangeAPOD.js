const axios = require('axios');

const GetRangeAPOD = async(req, res) => {
    try{
      const {startDate, endDate} = req.query
      console.log(startDate, endDate);
      const response = await axios.get('https://api.nasa.gov/planetary/apod', {
          params: { 
              'start_date': startDate,
              'end_date': endDate,
              'api_key': process.env.NASA_API_KEY,
          }
        });
        res.json(response.data);

    }catch (error) {
      console.error('Error fetching NASA APOD:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch APOD range', details: error.response?.data || error.message });
    }
    

}
module.exports = GetRangeAPOD;