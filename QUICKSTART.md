# Quick Start Guide - Flex Living Reviews

Get the entire system running locally in under 10 minutes.

## Prerequisites Checklist

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version

# Install Vercel CLI globally
npm install -g vercel
```

## Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd "c:\Users\Samuel O. Anari\Flex_assessment\flex-backend"

# Install dependencies
npm install

# Login to Vercel (opens browser)
vercel login

# Link to Vercel project and create Postgres database
vercel link
vercel postgres create flex-reviews-db

# Pull environment variables (includes Postgres credentials)
vercel env pull .env.local

# Set up database tables
npm run db:setup

# Seed with mock review data
npm run db:seed

# Start backend server
npm run dev
```

**Verify:** Open [http://localhost:3001](http://localhost:3001) - should see API documentation page.

**Test API:**
```bash
curl http://localhost:3001/api/reviews/hostaway
```

Should return JSON with reviews.

---

## Step 2: Frontend Setup (3 minutes)

```bash
# Open new terminal, navigate to frontend
cd "c:\Users\Samuel O. Anari\Flex_assessment\flex-guest-reviews"

# Install dependencies
npm install

# Create environment file
echo VITE_API_URL=http://localhost:3001 > .env.local

# Start frontend dev server
npm run dev
```

**Verify:** Open [http://localhost:8080](http://localhost:8080)

---

## Step 3: Test the Application (2 minutes)

### Manager Dashboard

1. Visit: [http://localhost:8080/dashboard](http://localhost:8080/dashboard)
2. You should see:
   - KPI cards (total reviews, average rating, etc.)
   - Charts showing trends
   - Reviews table with mock data
3. **Test approval toggle:**
   - Click the switch on any review
   - Should see toast notification
   - Review approval status updates immediately

### Public Property Page

1. Visit: [http://localhost:8080/property/253093](http://localhost:8080/property/253093)
2. You should see:
   - Property details
   - Reviews section (only approved reviews)
   - Rating summary
3. **Test filtering:**
   - Try "Load More" button
   - Change sort order

---

## Troubleshooting

### ❌ Backend won't start

**Error:** "Cannot find module '@vercel/postgres'"
```bash
cd flex-backend
npm install
```

**Error:** Database connection failed
```bash
# Re-pull environment variables
vercel env pull .env.local

# Verify .env.local contains POSTGRES_URL
cat .env.local
```

### ❌ Frontend shows empty dashboard

**Check backend is running:**
```bash
curl http://localhost:3001/api/reviews/hostaway
```

**Check VITE_API_URL:**
```bash
# In flex-guest-reviews/.env.local
cat .env.local
# Should show: VITE_API_URL=http://localhost:3001
```

**Restart frontend:**
```bash
cd flex-guest-reviews
npm run dev
```

### ❌ Database tables don't exist

```bash
cd flex-backend
npm run db:setup
npm run db:seed
```

### ❌ No reviews showing

```bash
# Check database has data
cd flex-backend
vercel postgres sql flex-reviews-db "SELECT COUNT(*) FROM reviews;"

# If zero, re-seed
npm run db:seed
```

---

## Next Steps

✅ **Local development working?** → Proceed to deployment: [DEPLOYMENT.md](DEPLOYMENT.md)

✅ **Want to modify the frontend?** → See [flex-guest-reviews/README.md](flex-guest-reviews/README.md)

✅ **Want to add API endpoints?** → See [flex-backend/README.md](flex-backend/README.md)

---

## Development Workflow

### Making Changes to Backend

```bash
cd flex-backend

# Edit files in app/api/ or lib/
# Changes auto-reload (Next.js hot reload)

# Test changes
curl http://localhost:3001/api/reviews/hostaway
```

### Making Changes to Frontend

```bash
cd flex-guest-reviews

# Edit files in src/
# Changes auto-reload (Vite HMR)

# Check browser at http://localhost:8080
```

### Adding More Mock Reviews

Edit [flex-backend/lib/mockReviews.json](flex-backend/lib/mockReviews.json), then:

```bash
cd flex-backend
npm run db:seed
```

---

## Useful Commands

### Backend

```bash
# Start dev server (port 3001)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Database setup
npm run db:setup

# Seed data
npm run db:seed
```

### Frontend

```bash
# Start dev server (port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Backend API | 3001 | http://localhost:3001 |
| Frontend | 8080 | http://localhost:8080 |

---

## Quick Test Checklist

- [ ] Backend API returns reviews: `curl http://localhost:3001/api/reviews/hostaway`
- [ ] Frontend dashboard loads at http://localhost:8080/dashboard
- [ ] KPI cards display data
- [ ] Charts render
- [ ] Reviews table shows data
- [ ] Approval toggle works (shows toast notification)
- [ ] Property page shows reviews at http://localhost:8080/property/253093
- [ ] Only approved reviews appear on property page

---

**All working?** 🎉 You're ready to deploy! See [DEPLOYMENT.md](DEPLOYMENT.md)

**Still having issues?** Check the main [README.md](README.md) for detailed documentation.
