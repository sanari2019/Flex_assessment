# Flex Living Reviews Dashboard - Full Stack Application

Complete reviews management system for Flex Living properties with manager dashboard and public-facing reviews display.

## 📋 Project Overview

This assessment project consists of three main components:

1. **Backend API** (Next.js API Routes) - Manages review data and approvals
2. **Frontend Dashboard** (Vite + React) - Manager interface for reviewing and approving guest reviews
3. **Public Display** (Vite + React) - Customer-facing reviews on property pages

## 🏗 Architecture

```
┌──────────────────────────────────────────────┐
│  Frontend (Vite + React + TypeScript)        │
│  - Manager Dashboard                         │
│  - Public Property Pages                     │
│  - Reviews Display                           │
└───────────────┬──────────────────────────────┘
                │ REST API Calls
                ↓
┌──────────────────────────────────────────────┐
│  Backend (Next.js API Routes)                │
│  - GET /api/reviews/hostaway                 │
│  - PATCH /api/reviews/hostaway/:id           │
└───────────────┬──────────────────────────────┘
                │ SQL Queries
                ↓
┌──────────────────────────────────────────────┐
│  Database (Vercel Postgres)                  │
│  - Reviews table with approval tracking      │
└──────────────────────────────────────────────┘
```

## 📁 Project Structure

```
Flex_assessment/
├── flex-backend/              # Next.js API Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── reviews/
│   │   │       └── hostaway/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── db.ts              # Database functions
│   │   ├── types.ts           # TypeScript types
│   │   └── mockReviews.json   # Seed data
│   ├── scripts/
│   │   ├── setup-database.ts  # DB schema
│   │   └── seed-reviews.ts    # Data seeding
│   ├── package.json
│   └── README.md
│
├── flex-guest-reviews/        # Vite React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── property/      # Property page components
│   │   │   ├── reviews/       # Review display components
│   │   │   └── public/        # Public layout components
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PropertyPage.tsx
│   │   │   └── PropertiesPage.tsx
│   │   ├── hooks/
│   │   │   └── useReviews.ts  # React Query hooks
│   │   ├── lib/
│   │   │   └── api.ts         # API client
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
│
├── DEPLOYMENT.md              # Complete deployment guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Vercel account (for database)

### 1. Backend Setup

```bash
# Navigate to backend
cd flex-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Vercel Postgres credentials

# Set up database schema
npm run db:setup

# Seed mock data
npm run db:seed

# Start backend server
npm run dev
```

Backend runs on [http://localhost:3001](http://localhost:3001)

### 2. Frontend Setup

```bash
# Navigate to frontend
cd flex-guest-reviews

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local to point to backend: VITE_API_URL=http://localhost:3001

# Start frontend dev server
npm run dev
```

Frontend runs on [http://localhost:8080](http://localhost:8080)

### 3. Access the Application

- **Manager Dashboard:** [http://localhost:8080/dashboard](http://localhost:8080/dashboard)
- **Property Page:** [http://localhost:8080/property/253093](http://localhost:8080/property/253093)
- **Backend API Docs:** [http://localhost:3001](http://localhost:3001)

## 🎯 Features Implemented

### ✅ Core Requirements

- [x] **Hostaway Integration (Mocked)**
  - Mock review data from provided JSON
  - Normalized data structure
  - Parsing by listing, review type, channel, and date

- [x] **Manager Dashboard**
  - Per-property performance view
  - Filtering by rating, category, channel, time
  - Trend visualization (charts)
  - Review approval system for website display

- [x] **Review Display Page**
  - Replicates Flex Living property detail layout
  - Dedicated reviews section
  - Only approved reviews displayed
  - Consistent design with Flex Living branding

- [x] **API Route Implementation**
  - `GET /api/reviews/hostaway` - Fetch and normalize reviews
  - `PATCH /api/reviews/hostaway/:id` - Toggle approval
  - Query parameters for filtering
  - Returns structured, usable data

### 🎨 Design System

Matching Flex Living's design language:

**Colors:**
- Primary: `#284E4C` (Teal)
- Background: `#FFFDF7` (Cream)
- Text: `#5C5C5A` (Gray)
- Accent: `#FFF9E9` (Light Cream)

**Typography:**
- System font stack
- Clean, modern sans-serif
- Consistent hierarchy

**Components:**
- Cards with subtle shadows
- Pill-shaped badges
- Clean data tables
- Interactive charts (Recharts)

## 🗄 Database Schema

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

## 🔌 API Endpoints

### GET /api/reviews/hostaway

Fetch reviews with optional filters.

**Query Params:**
- `listingId` - Filter by property
- `channel` - Airbnb | Booking.com | Direct
- `type` - host-to-guest | guest-to-host
- `ratingMin` - Minimum rating
- `approvedOnly` - Boolean
- `limit`, `offset` - Pagination

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "averageRating": 9.2,
    "categoryAverages": {...}
  }
}
```

### PATCH /api/reviews/hostaway/:id

Update review approval status.

**Body:**
```json
{
  "approvedForWebsite": true
}
```

## 🛠 Tech Stack

### Backend
- **Next.js 15** - API Routes (serverless)
- **TypeScript** - Type safety
- **Vercel Postgres** - Database
- **date-fns** - Date utilities

### Frontend
- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching & caching
- **React Router DOM** - Routing
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

**Summary:**
1. Deploy backend to Vercel (auto-provisions Postgres)
2. Run database setup and seeding
3. Deploy frontend to Vercel
4. Configure custom domains via Namecheap:
   - `api.yourdomain.com` → Backend
   - `reviews.yourdomain.com` → Frontend

## 🧪 Testing

### Backend API Testing

```bash
# Get all reviews
curl http://localhost:3001/api/reviews/hostaway

# Get approved reviews for specific property
curl "http://localhost:3001/api/reviews/hostaway?listingId=253093&approvedOnly=true"

# Update approval status
curl -X PATCH http://localhost:3001/api/reviews/hostaway/1 \
  -H "Content-Type: application/json" \
  -d '{"approvedForWebsite": true}'
```

### Frontend Testing

1. **Dashboard:**
   - Apply various filters
   - Toggle review approvals
   - Check optimistic updates
   - Verify charts render correctly

2. **Property Page:**
   - Ensure only approved reviews show
   - Test load more functionality
   - Verify design matches Flex Living style

## 📝 Key Design Decisions

### 1. **Separate Backend Service**
- Chose Next.js API Routes over full Express server for simplicity
- Vercel deployment = zero DevOps
- Serverless functions = auto-scaling

### 2. **Vercel Postgres**
- No Docker needed
- Managed, serverless database
- Free tier sufficient for assessment
- Easy migration to production tier

### 3. **Optimistic Updates**
- Review approval toggles update UI immediately
- Falls back on error
- Better UX than waiting for server response

### 4. **Data Normalization**
- Convert Hostaway's nested `reviewCategory` array to flat object
- Calculate overall rating from category averages if missing
- Add computed fields (channel, relative dates)

### 5. **Design Matching**
- Extracted exact colors from Flex Living site
- Replicated component styles (cards, badges, spacing)
- Used similar layout patterns

## 🔍 Google Reviews Integration (Findings)

**Explored:** Google Places API integration

**Findings:**
- **Feasible:** Yes, via Google Places API
- **Requirements:**
  - Each property needs a Google Place ID
  - Manual mapping of Hostaway properties to Google Places
- **Limitations:**
  - Returns max 5 most helpful reviews per place
  - API cost: $17 per 1,000 requests
  - Rate limits apply
- **Recommendation:** Phase 2 feature
  - Requires business process for Place ID mapping
  - Consider cost vs. benefit (Hostaway already aggregates channel reviews)

## 📚 Documentation

- [Backend README](flex-backend/README.md) - API documentation
- [Frontend README](flex-guest-reviews/README.md) - Lovable.dev setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

## 🎓 Assessment Evaluation Criteria

| Criteria | Implementation |
|----------|----------------|
| **JSON Data Handling** | ✅ Normalized Hostaway response, converted to flat structure |
| **Code Clarity** | ✅ TypeScript, modular components, clear separation of concerns |
| **UX/UI Design** | ✅ Matches Flex Living design, intuitive dashboard, responsive |
| **Dashboard Features** | ✅ Filtering, sorting, trends, approval system, KPIs |
| **Problem-Solving** | ✅ Optimistic updates, error handling, CORS configuration |

## 🐛 Known Issues & Future Enhancements

### Known Issues
- None critical for assessment

### Future Enhancements
- [ ] Authentication for dashboard
- [ ] Real-time updates (WebSockets)
- [ ] Export reviews to CSV
- [ ] Sentiment analysis
- [ ] Manager response feature
- [ ] Email notifications
- [ ] Multi-language support

## 📄 License

Private - Flex Living Developer Assessment

## 🙋‍♂️ Questions?

For questions or clarifications about this implementation, refer to:
- Code comments in source files
- API documentation at backend root
- DEPLOYMENT.md for setup issues

---

**Built with ❤️ for Flex Living Assessment**

Stack: Next.js + React + TypeScript + Vercel Postgres
No Docker Required • Fully Serverless • Production-Ready





install by running 'npm install -g vercel' globally
vercel --version
vercel login
