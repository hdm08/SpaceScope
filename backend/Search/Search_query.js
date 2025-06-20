const axios = require('axios');

const Search = async (req, res) => {
  try {
    const { q, media_type, year_start, year_end } = req.query;

    // Construct NASA API URL with the query q
    const nasaUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}`;

    const response = await axios.get(nasaUrl);
    const items = response.data.collection.items;

    // Filter items by media_type if specified
    let filteredItems = items;
    if (media_type) {
      filteredItems = filteredItems.filter(
        (item) => item.data[0]?.media_type === media_type
      );
    }

    // Filter items by year range if specified (default values could be added)
    const startYear = parseInt(year_start, 10) || 1960;
    const endYear = parseInt(year_end, 10) || new Date().getFullYear();

    filteredItems = filteredItems.filter((item) => {
      const dateCreated = new Date(item.data[0]?.date_created);
      const year = dateCreated.getFullYear();
      return year >= startYear && year <= endYear;
    });

    // Sort by date_created descending
    const sortedItems = filteredItems.sort((a, b) =>
      new Date(b.data[0]?.date_created) - new Date(a.data[0]?.date_created)
    );

    res.json(sortedItems);
  } catch (error) {
    console.error('Error fetching from NASA API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

module.exports = Search;
