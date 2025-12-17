# Flex Living Reviews API Backend

Backend API service for managing property reviews for Flex Living.

## Tech Stack

- **Next.js 15** - API Routes (serverless functions)
- **TypeScript** - Type safety
- **Vercel Postgres** - Serverless PostgreSQL database
- **date-fns** - Date utilities

## Project Structure

```
flex-backend/
├── app/
│   ├── api/
│   │   └── reviews/
│   │       └── hostaway/
│   │           ├── route.ts          # GET /api/reviews/hostaway
│   │           └── [id]/
│   │               └── route.ts      # GET, PATCH /api/reviews/hostaway/:id
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts                         # Database functions
│   ├── types.ts                      # TypeScript interfaces
│   └── mockReviews.json              # Mock data
├── scripts/
│   ├── setup-database.ts             # Database schema creation
│   └── seed-reviews.ts               # Seed mock data
└── package.json
```

## Local Setup

### Prerequisites

- Node.js 18+ and npm
- Vercel account (for database)

### Installation

1. **Install dependencies:**
   ```bash
   cd flex-backend
   npm install
   ```

2. **Set up Vercel Postgres:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link project
   vercel link

   # Create Postgres database
   vercel postgres create

   # Pull environment variables
   vercel env pull .env.local
   ```

3. **Set up database schema:**
   ```bash
   npm run db:setup
   ```

4. **Seed database with mock data:**
   ```bash
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Backend will run on [http://localhost:3001](http://localhost:3001)

## API Endpoints

### GET /api/reviews/hostaway

Fetch all reviews with optional filters.

**Query Parameters:**
- `listingId` - Filter by property ID
- `channel` - Filter by channel (Airbnb, Booking.com, Direct)
- `type` - Filter by review type (host-to-guest, guest-to-host)
- `ratingMin` - Minimum rating (1-10)
- `dateStart` - Start date (ISO 8601)
- `dateEnd` - End date (ISO 8601)
- `approvedOnly` - Only approved reviews (true/false)
- `limit` - Number of results (default: 100)
- `offset` - Pagination offset (default: 0)

**Example:**
```bash
curl "http://localhost:3001/api/reviews/hostaway?listingId=253093&approvedOnly=true"
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 100,
    "averageRating": 9.2,
    "categoryAverages": {
      "cleanliness": 9.5,
      "communication": 9.1,
      "location": 9.8
    }
  }
}
```

### GET /api/reviews/hostaway/:id

Fetch a single review by ID.

**Example:**
```bash
curl "http://localhost:3001/api/reviews/hostaway/1"
```

### PATCH /api/reviews/hostaway/:id

Update review approval status.

**Body:**
```json
{
  "approvedForWebsite": true
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3001/api/reviews/hostaway/1" \
  -H "Content-Type: application/json" \
  -d '{"approvedForWebsite": true}'
```

## Database Schema

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  hostaway_id INTEGER UNIQUE NOT NULL,
  listing_id VARCHAR(255) NOT NULL,
  listing_name TEXT NOT NULL,
  guest_name VARCHAR(255),
  rating DECIMAL(3,1),
  comment TEXT,
  categories JSONB,
  submitted_at TIMESTAMP NOT NULL,
  channel VARCHAR(50),
  review_type VARCHAR(50),
  status VARCHAR(50),
  approved_for_website BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy via Vercel:**
   ```bash
   vercel --prod
   ```

   Or connect your GitHub repo in the Vercel dashboard.

3. **Set environment variables in Vercel:**
   - `HOSTAWAY_ACCOUNT_ID`
   - `HOSTAWAY_API_KEY`
   - Postgres variables (auto-configured)

4. **Run database setup on Vercel:**
   ```bash
   vercel env pull
   npm run db:setup
   npm run db:seed
   ```

## CORS Configuration

The API is configured to allow requests from any origin in [next.config.js](next.config.js). For production, update the `Access-Control-Allow-Origin` header to match your frontend domain.

## Environment Variables

```bash
# Required
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152

# Auto-configured by Vercel
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Testing

Visit [http://localhost:3001](http://localhost:3001) to see the API documentation page.

## License

Private - Flex Living Assessment Project
