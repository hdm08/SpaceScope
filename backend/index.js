const express = require('express');
const cors = require('cors');
const GetAPOD = require('./APOD/GetAPOD');
const GetRangeAPOD = require('./APOD/GetRangeAPOD');
const Weather = require('./Mars_Insights/Mars_Weather');
const Search = require('./Search/Search_query');
const NeoBrowse = require('./Neo/neoBrowse');
const NeoFeed = require('./Neo/neoFeed');
const NeoLookup = require('./Neo/neoLookup');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.get('/api/apod', GetAPOD)
app.get('/api/apod/range', GetRangeAPOD)
app.get('/api/weather', Weather);
app.get('/api/search', Search);

app.get('/api/neo/browse', NeoBrowse);
app.get('/api/neo/feed', NeoFeed);
app.get('/api/neo/lookup/:asteroidId', NeoLookup);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

