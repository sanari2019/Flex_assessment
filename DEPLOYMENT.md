# Flex Living Reviews - Deployment Guide

Complete guide to deploying the Flex Living Reviews system (Frontend + Backend) to Vercel with Namecheap domain.

## Architecture Overview

```
┌─────────────────────────────────────┐
│  Frontend (Vite + React)            │
│  Domain: reviews.yourdomain.com     │
│  Deployed to: Vercel                │
└──────────────┬──────────────────────┘
               │ API Calls
               ↓
┌─────────────────────────────────────┐
│  Backend (Next.js API Routes)       │
│  Domain: api.yourdomain.com         │
│  Deployed to: Vercel                │
└──────────────┬──────────────────────┘
               │ SQL Queries
               ↓
┌─────────────────────────────────────┐
│  Database (Vercel Postgres)         │
│  Managed by: Vercel                 │
└─────────────────────────────────────┘
```

---

## Prerequisites

- [x] Node.js 18+ installed
- [x] Git installed
- [x] Vercel account (free tier works)
- [x] Namecheap domain purchased
- [x] GitHub account (recommended)

---

## Part 1: Deploy Backend API

### Step 1.1: Prepare Backend for Deployment

```bash
cd c:\Users\Samuel O. Anari\Flex_assessment\flex-backend

# Initialize git repository
git init
git add .
git commit -m "Initial backend setup"
```

### Step 1.2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository: `flex-reviews-backend`
3. **Do not** initialize with README (we already have code)
4. Copy the repository URL

```bash
# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/flex-reviews-backend.git
git branch -M main
git push -u origin main
```

### Step 1.3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Import Project"
3. Import your `flex-reviews-backend` repository
4. **Framework Preset:** Next.js (auto-detected)
5. **Root Directory:** `./` (default)
6. **Build Command:** `next build` (default)
7. **Output Directory:** `.next` (default)
8. Click "Deploy"

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd flex-backend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: flex-reviews-backend
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Step 1.4: Set Up Vercel Postgres

1. In Vercel Dashboard, go to your `flex-reviews-backend` project
2. Go to **Storage** tab
3. Click "Create Database"
4. Select **Postgres**
5. Database name: `flex-reviews-db`
6. Region: Choose closest to your users (e.g., `us-east-1`)
7. Click "Create"

Vercel will automatically add environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Step 1.5: Add Hostaway Credentials

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add the following:

```
HOSTAWAY_ACCOUNT_ID = 61148
HOSTAWAY_API_KEY = f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
```

3. Apply to: **Production, Preview, and Development**
4. Click "Save"

### Step 1.6: Initialize Database

```bash
# Pull environment variables locally
vercel env pull .env.local

# Run database setup
npm run db:setup

# Seed mock data
npm run db:seed
```

**Important:** If you get permission errors, run the setup via Vercel CLI:

```bash
# Option 1: Use Vercel CLI to run scripts remotely
vercel dev
# Then in another terminal:
npm run db:setup
npm run db:seed

# Option 2: Run via Vercel Functions (one-time)
# Create a temporary API route to run setup, then delete it after
```

### Step 1.7: Test Backend API

Your backend should now be live at: `https://flex-reviews-backend.vercel.app`

Test endpoints:
```bash
# Get all reviews
curl https://flex-reviews-backend.vercel.app/api/reviews/hostaway

# Get approved reviews only
curl "https://flex-reviews-backend.vercel.app/api/reviews/hostaway?approvedOnly=true"
```

---

## Part 2: Deploy Frontend

### Step 2.1: Update Frontend Environment Variables

```bash
cd c:\Users\Samuel O. Anari\Flex_assessment\flex-guest-reviews
```

Edit [.env.local](flex-guest-reviews/.env.local):
```bash
# Replace with your deployed backend URL
VITE_API_URL=https://flex-reviews-backend.vercel.app
```

Also update [.env.example](flex-guest-reviews/.env.example) for documentation.

### Step 2.2: Test Locally with Backend

```bash
# Start frontend
npm run dev

# Should connect to deployed backend
# Open http://localhost:8080
```

Verify:
- Dashboard loads reviews from backend
- Approval toggle works
- Property pages show approved reviews

### Step 2.3: Create GitHub Repository for Frontend

```bash
cd flex-guest-reviews

# Initialize git (if not already done by Lovable)
git init
git add .
git commit -m "Connect to backend API"

# Create repo on GitHub: flex-reviews-frontend
git remote add origin https://github.com/YOUR_USERNAME/flex-reviews-frontend.git
git branch -M main
git push -u origin main
```

### Step 2.4: Deploy Frontend to Vercel

#### Via Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import `flex-reviews-frontend` repository
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

7. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://flex-reviews-backend.vercel.app`
   - Apply to all environments

8. Click "Deploy"

#### Via CLI:

```bash
cd flex-guest-reviews
vercel --prod
```

### Step 2.5: Test Deployed Frontend

Your frontend should now be live at: `https://flex-reviews-frontend.vercel.app`

Test:
- Visit dashboard
- Toggle review approvals
- View property pages with reviews

---

## Part 3: Connect Custom Domain (Namecheap)

### Step 3.1: Configure Backend Domain

**Goal:** Point `api.yourdomain.com` to backend

1. **In Vercel Dashboard:**
   - Go to `flex-reviews-backend` project
   - Settings → Domains
   - Add domain: `api.yourdomain.com`
   - Vercel will provide DNS records

2. **In Namecheap:**
   - Login → Domain List → Manage
   - Advanced DNS
   - Add **CNAME Record:**
     - Type: `CNAME`
     - Host: `api`
     - Value: `cname.vercel-dns.com`
     - TTL: Automatic

3. **Wait for DNS propagation** (5-60 minutes)

4. **Verify:**
   ```bash
   curl https://api.yourdomain.com/api/reviews/hostaway
   ```

### Step 3.2: Configure Frontend Domain

**Option A: Use Subdomain** (e.g., `reviews.yourdomain.com`)

1. **In Vercel Dashboard:**
   - Go to `flex-reviews-frontend` project
   - Settings → Domains
   - Add domain: `reviews.yourdomain.com`

2. **In Namecheap:**
   - Add **CNAME Record:**
     - Type: `CNAME`
     - Host: `reviews`
     - Value: `cname.vercel-dns.com`
     - TTL: Automatic

**Option B: Use Root Domain** (e.g., `yourdomain.com`)

1. **In Vercel Dashboard:**
   - Add domain: `yourdomain.com`

2. **In Namecheap:**
   - Add **A Record:**
     - Type: `A`
     - Host: `@`
     - Value: `76.76.21.21` (Vercel's IP)
     - TTL: Automatic

### Step 3.3: Update Frontend Environment Variable

1. In Vercel Dashboard → `flex-reviews-frontend` → Settings → Environment Variables
2. Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://api.yourdomain.com
   ```
3. Redeploy frontend:
   ```bash
   cd flex-guest-reviews
   vercel --prod
   ```

### Step 3.4: Enable HTTPS (Automatic)

Vercel automatically provisions SSL certificates via Let's Encrypt. Wait 2-5 minutes after DNS propagates.

---

## Part 4: Final Configuration & Testing

### Update CORS for Production

Edit [flex-backend/next.config.js](flex-backend/next.config.js):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://reviews.yourdomain.com' // Update to your frontend domain
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

Commit and push changes:
```bash
cd flex-backend
git add .
git commit -m "Update CORS for production domain"
git push
```

Vercel will auto-deploy.

### Full System Test

1. **Manager Dashboard:**
   - Visit `https://reviews.yourdomain.com/dashboard`
   - Verify reviews load
   - Toggle approval on/off
   - Apply filters (property, rating, channel)
   - Check charts render

2. **Public Property Page:**
   - Visit `https://reviews.yourdomain.com/property/253093`
   - Verify only approved reviews show
   - Test "Load More" functionality

3. **API Direct Test:**
   ```bash
   # Get all reviews
   curl https://api.yourdomain.com/api/reviews/hostaway

   # Get property-specific approved reviews
   curl "https://api.yourdomain.com/api/reviews/hostaway?listingId=253093&approvedOnly=true"
   ```

---

## Part 5: Ongoing Maintenance

### Update Backend

```bash
cd flex-backend
# Make changes
git add .
git commit -m "Your changes"
git push
# Vercel auto-deploys
```

### Update Frontend

```bash
cd flex-guest-reviews
# Make changes
git add .
git commit -m "Your changes"
git push
# Vercel auto-deploys
```

### Database Backups

Vercel Postgres (free tier) doesn't include automatic backups. For production:

1. **Upgrade to Pro:** Vercel Postgres Pro includes backups
2. **Manual Backup:**
   ```bash
   # Export data
   vercel postgres export flex-reviews-db > backup.sql
   ```

### Monitor Logs

- **Frontend Logs:** Vercel Dashboard → flex-reviews-frontend → Logs
- **Backend Logs:** Vercel Dashboard → flex-reviews-backend → Logs
- **Database Logs:** Vercel Dashboard → Storage → flex-reviews-db → Logs

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Check:**
```bash
# Verify VITE_API_URL is set correctly
# In browser console:
console.log(import.meta.env.VITE_API_URL)
```

**Fix:** Update environment variable in Vercel and redeploy.

### Issue: CORS errors in browser

**Fix:** Ensure backend `next.config.js` allows your frontend domain.

### Issue: Database connection fails

**Check:**
```bash
# Verify Postgres env vars are set
vercel env ls
```

**Fix:** Recreate database or check connection string.

### Issue: Reviews not loading

**Check backend API directly:**
```bash
curl https://api.yourdomain.com/api/reviews/hostaway
```

If empty response, re-run seed:
```bash
vercel env pull .env.local
npm run db:seed
```

---

## Summary Checklist

- [x] Backend deployed to Vercel
- [x] Vercel Postgres database created
- [x] Database schema created (`npm run db:setup`)
- [x] Mock data seeded (`npm run db:seed`)
- [x] Backend API endpoints tested
- [x] Frontend deployed to Vercel
- [x] Frontend environment variables set
- [x] Custom domain `api.yourdomain.com` configured
- [x] Custom domain `reviews.yourdomain.com` configured
- [x] CORS configured for production
- [x] Full system tested end-to-end
- [x] SSL certificates active (HTTPS working)

---

## Production URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | `https://reviews.yourdomain.com` | Public & Dashboard |
| Backend API | `https://api.yourdomain.com` | API Endpoints |
| API Docs | `https://api.yourdomain.com` | Landing page with endpoints |

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Namecheap DNS Setup](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-vercel/)

---

**Deployment Complete! 🚀**

Your Flex Living Reviews system is now live in production.
