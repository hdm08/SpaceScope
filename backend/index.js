const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('NASA API Backend is running!'));
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app