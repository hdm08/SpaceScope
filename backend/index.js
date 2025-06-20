const express = require('express');
const cors = require('cors');
const GetAPOD = require('./Api/APOD/GetAPOD');
const GetRangeAPOD = require('./Api/APOD/GetRangeAPOD');
const Weather = require('./Mars_Insights/Mars_Weather');
const Search = require('./Search/Search_query');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/apod', GetAPOD)
app.get('/api/apod/range', GetRangeAPOD)
app.get('/api/weather', Weather);
app.get('/api/search', Search)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

