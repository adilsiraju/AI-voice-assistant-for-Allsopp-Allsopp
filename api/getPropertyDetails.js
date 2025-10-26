const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Read the JSON file
    const filePath = path.join(__dirname, '..', 'property_listings.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let listings = data.properties;

    const { area, budget, type } = req.body;

    // Filter by area (location)
    if (area) {
      listings = listings.filter(l => l.location.toLowerCase().includes(area.toLowerCase()));
    }

    // Filter by budget (approximate, using min price from range)
    if (budget) {
      listings = listings.filter(l => {
        const priceMatch = l.price.match(/AED\s([\d,]+)/);
        if (!priceMatch) return false;
        const minPrice = parseInt(priceMatch[1].replace(/,/g, ''));
        return minPrice <= parseInt(budget);
      });
    }

    // Filter by type (assuming type refers to something in title or amenities, e.g., "apartment", "duplex")
    if (type) {
      listings = listings.filter(l =>
        l.title.toLowerCase().includes(type.toLowerCase()) ||
        l.amenities.some(a => a.toLowerCase().includes(type.toLowerCase()))
      );
    }

    if (listings.length === 0) {
      return res.json({ response: "No properties found matching your search." });
    }

    // Format response similar to the provided code
    const results = listings.slice(0, 3).map(l =>
      `${l.title} in ${l.location}, starting at ${l.price} AED.`
    );

    res.json({ response: results.join(" ") });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ response: "Error fetching listings." });
  }
};