const axios = require('axios');

const Search = async (req, res) => {
  try {
    const { q, media_type, year_start, year_end, page = 1 } = req.query;

    // Construct NASA API URL with query parameters
    const baseUrl = 'https://images-api.nasa.gov/search';
    const params = {
      q: q || 'nasa', // Changed default to 'nasa' for broader results
      media_type: media_type || undefined,
      year_start: year_start || 1960,
      year_end: year_end || new Date().getFullYear(),
      page,
    };

    // Fetch multiple pages
    let allItems = [];
    const maxItems = 500;
    let currentPage = parseInt(page, 10) || 1;
    let hasMore = true;

    while (hasMore && allItems.length < maxItems) {
      console.log(`Fetching page ${currentPage} with params:`, params); // Debug log
      const response = await axios.get(baseUrl, {
        params: { ...params, page: currentPage },
      });

      const items = response.data.collection.items || [];
      console.log(`Page ${currentPage}: ${items.length} items, Total Hits: ${response.data.collection.metadata.total_hits}`); // Debug log
      allItems = [...allItems, ...items];

      const totalItems = response.data.collection.metadata.total_hits || 0;
      const itemsPerPage = 100;
      hasMore = currentPage * itemsPerPage < totalItems && items.length > 0;
      currentPage += 1;

      if (allItems.length >= maxItems || items.length === 0) {
        hasMore = false;
      }
    }

    console.log(`Total items before filtering: ${allItems.length}`); // Debug log

    // Filter items by media_type if specified
    let filteredItems = allItems;
    if (media_type) {
      filteredItems = filteredItems.filter((item) => item.data[0]?.media_type === media_type);
      console.log(`After media_type filter (${media_type}): ${filteredItems.length} items`); // Debug log
    }

    // Filter items by year range
    const startYear = parseInt(year_start, 10) || 1960;
    const endYear = parseInt(year_end, 10) || new Date().getFullYear();
    filteredItems = filteredItems.filter((item) => {
      const dateCreated = item.data[0]?.date_created ? new Date(item.data[0].date_created) : null;
      if (!dateCreated || isNaN(dateCreated)) {
        console.log(`Skipping item with invalid date:`, item.data[0]?.nasa_id); // Debug log
        return false;
      }
      const year = dateCreated.getFullYear();
      return year >= startYear && year <= endYear;
    });

    console.log(`After year filter (${startYear}-${endYear}): ${filteredItems.length} items`); // Debug log

    // Sort by date_created descending
    const sortedItems = filteredItems.sort(
      (a, b) => new Date(b.data[0]?.date_created || 0) - new Date(a.data[0]?.date_created || 0)
    );

    // Limit to maxItems
    const finalItems = sortedItems.slice(0, maxItems);
    console.log(`Final Items: ${finalItems.length}`); // Debug log

    res.json(finalItems);
  } catch (error) {
    console.error('Error fetching from NASA API:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch data from NASA API' });
  }
};

module.exports = Search;