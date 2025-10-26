const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Read the JSON file
    const filePath = path.join(__dirname, '..', 'property_listings.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let properties = data.properties;

    // Get query parameters
    const { location, minPrice, maxPrice, handoverDate, amenity } = req.query;

    // Filter by location (case insensitive)
    if (location) {
      properties = properties.filter(p =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      properties = properties.filter(p => {
        // Extract numbers from price string like "AED 736,000 – AED 3,000,000"
        const priceMatch = p.price.match(/AED\s([\d,]+).*?AED\s([\d,]+)/);
        if (!priceMatch) return false;

        const min = parseInt(priceMatch[1].replace(/,/g, ''));
        const max = parseInt(priceMatch[2].replace(/,/g, ''));

        const filterMin = minPrice ? parseInt(minPrice) : 0;
        const filterMax = maxPrice ? parseInt(maxPrice) : Infinity;

        // Check if the property's price range overlaps with filter range
        return max >= filterMin && min <= filterMax;
      });
    }

    // Filter by handover date
    if (handoverDate) {
      properties = properties.filter(p =>
        p.handoverDate.toLowerCase().includes(handoverDate.toLowerCase())
      );
    }

    // Filter by amenity
    if (amenity) {
      properties = properties.filter(p =>
        p.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      );
    }

    // Return filtered results
    res.status(200).json({
      metadata: {
        ...data.metadata,
        filteredCount: properties.length
      },
      properties
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};