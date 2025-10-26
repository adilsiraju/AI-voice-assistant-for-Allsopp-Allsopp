# Property Listings Serverless API

This is a serverless API built with Vercel that allows filtering property listings from the `property_listings.json` file.

## Deployment

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in this directory to deploy

## API Endpoints

### GET /api/filter
Filters properties based on query parameters and returns JSON data.

**Query Parameters:**
- `location`: Filter by location (partial match, case insensitive)
- `minPrice`: Minimum price in AED (numeric)
- `maxPrice`: Maximum price in AED (numeric)
- `handoverDate`: Filter by handover date (partial match, case insensitive)
- `amenity`: Filter by amenity (partial match, case insensitive)

**Example:** `GET /api/filter?location=Jumeirah&minPrice=1000000`

### POST /api/getPropertyDetails
Returns a natural language response with up to 3 matching properties for AI voice assistant.

**Request Body:**
```json
{
  "area": "Jumeirah",
  "budget": "3000000",
  "type": "apartment"
}
```

**Response:**
```json
{
  "response": "SOL Levante in Jumeirah Village Triangle, starting at AED 736,000 – AED 3,000,000 AED. ..."
}
```

## Local Development

Run `npm run dev` to start local development server with Vercel CLI.