const axios = require('axios');

const Weather = async(req, res) =>{
    try {
        const params = {
          api_key: process.env.NASA_API_KEY,
          feedtype: 'json',
          ver: '1.0',
        };
    
        const response = await axios.get("https://api.nasa.gov/insight_weather/", { params });
        const data = response.data;
        
        // Filtering out invalid sols based on validity_checks
        const validSols = Object.fromEntries(
          Object.entries(data).filter(([sol, solData]) => sol !== 'validity_checks' && sol !== 'sol_keys' && data.validity_checks[sol]?.AT?.valid)
        );
    
        // Including validity_checks and sol_keys for completeness
        const responseData = {
          ...validSols,
          validity_checks: data.validity_checks,
          sol_keys: data.sol_keys,
        };
    
        res.json(responseData);
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
      }
    };

module.exports = Weather;