# BiteBox Deployment Guide: Backend on Render & Frontend on Vercel

This guide walks you through deploying **BiteBox** to production using:
- **Backend (NestJS 11 + Prisma 6 + SQLite/Postgres)** on **[Render](https://render.com/)**
- **Frontend (React 19 + Vite 8 + Tailwind CSS)** on **[Vercel](https://vercel.com/)**

---

## Architecture Overview

```
                                      ┌────────────────────────────────────────┐
                                      │              VERCEL                    │
                                      │                                        │
┌─────────────────────────┐           │   React 19 + Vite Frontend SPA         │
│         User            │ ────────> │   - Static hosting (CDN edge)          │
│   (Browser / Mobile)    │           │   - Handles SPA routes (/menu, etc.)   │
└─────────────────────────┘           │   - Proxies /api/* to Render           │
                                      └───────────────────┬────────────────────┘
                                                          │
                                         Proxy / Rewrites │ /api/*
                                                          ▼
                                      ┌────────────────────────────────────────┐
                                      │              RENDER                    │
                                      │                                        │
                                      │   NestJS 11 Web Service                │
                                      │   - Global prefix: /api                │
                                      │   - Swagger docs: /api/docs            │
                                      │   - Static uploads: /api/uploads/*     │
                                      │   - Prisma ORM + Database              │
                                      └────────────────────────────────────────┘
```

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Deploy Backend to Render](#step-1-deploy-backend-to-render)
   - [A. Create the Web Service](#a-create-the-web-service)
   - [B. Environment Variables](#b-environment-variables)
   - [C. Initial Database Seeding](#c-initial-database-seeding)
   - [D. Verify Backend Deployment](#d-verify-backend-deployment)
   - [E. Important Render Free-Tier Notes](#e-important-render-free-tier-notes)
3. [Step 2: Deploy Frontend to Vercel](#step-2-deploy-frontend-to-vercel)
   - [A. Configure `vercel.json` (Recommended)](#a-configure-verceljson-recommended)
   - [B. Alternative: Vite Environment Variable](#b-alternative-vite-environment-variable)
   - [C. Import Project on Vercel](#c-import-project-on-vercel)
   - [D. Verify Frontend Deployment](#d-verify-frontend-deployment)
4. [Step 3: End-to-End Verification Checklist](#step-3-end-to-end-verification-checklist)
5. [Step 4: Database Persistence & Upgrading to PostgreSQL](#step-4-database-persistence--upgrading-to-postgresql)
6. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Prerequisites

Before starting, ensure you have:
1. A **GitHub** or **GitLab** account with this BiteBox repository pushed.
2. A **[Render](https://render.com/)** account (free tier available).
3. A **[Vercel](https://vercel.com/)** account (free Hobby tier available).
4. Terminal access on your laptop to generate a secure secret.

---

## Step 1: Deploy Backend to Render

### A. Create the Web Service

1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** in the top navigation bar and select **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub/GitLab account.
4. Select your **BiteBox** repository.
5. Fill in the service configuration details:

| Setting | Value | Notes |
|---|---|---|
| **Name** | `bitebox-backend` | Or any unique name you prefer |
| **Region** | Choose closest to your users | e.g. *Singapore* for Asia, *Frankfurt* for Europe, *Oregon* for US |
| **Branch** | `main` | Or your working branch (e.g. `test`) |
| **Root Directory** | `backend` | **Critical**: ensures Render runs commands inside the `backend/` folder |
| **Runtime** | `Node` | |
| **Build Command** | `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` | See [Section C](#c-initial-database-seeding) for one-time seeding |
| **Start Command** | `npm run start:prod` | Runs `node dist/main` |
| **Instance Type** | `Free` | |

6. Scroll down to **Advanced** and set:
   - **Health Check Path**: `/api/health`
     - *BiteBox has a built-in health endpoint that verifies both NestJS and the database connection.*
   - **Auto-Deploy**: `Yes` (deploys automatically when you push to the selected branch).

---

### B. Environment Variables

Under the **Environment Variables** section on Render, add the following key-value pairs:

| Key | Example Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode for NestJS |
| `DATABASE_URL` | `postgresql://neondb_owner:***@ep-***-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Neon pooled connection string |
| `DATABASE_URL_UNPOOLED` | `postgresql://neondb_owner:***@ep-***.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Neon direct connection string (used by Prisma migrations) |
| `JWT_SECRET` | *(64-character hex string)* | Secret for signing auth tokens (generate below) |
| `ADMIN_EMAIL` | `admin@bitebox.com.np` | Initial admin account email |
| `ADMIN_PASSWORD` | *(Strong password)* | Initial admin account password |

> [!TIP]
> Generate a secure 64-character hex `JWT_SECRET` in your local terminal:
> ```bash
> openssl rand -hex 32
> ```

*(Note: Render automatically injects `PORT=10000`. BiteBox's `backend/src/main.ts` listens on `process.env.PORT ?? 3000` on `0.0.0.0` automatically, so you do not need to manually specify `PORT`.)*

---

### C. Initial Database Seeding

BiteBox includes a database seed script (`backend/prisma/seed.ts`) that populates categories, menu items, reviews, and creates the admin user.

Choose **one** of the two options below:

#### Option 1: One-time Build Command (Easiest)
1. For the **very first deployment**, change the **Build Command** in Render to:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run build
   ```
2. Click **Create Web Service** (or **Manual Deploy** -> **Deploy latest commit**).
3. Once deployed, verify in the build logs:
   ```
   🌱 Seeded BiteBox
      8 dishes across 4 categories
      2 reviews
      Admin → admin@bitebox.com.np / <your-password>
   ```
4. **Important**: After the initial seed finishes successfully, go back to **Settings** -> **Build Command** and remove `&& npx prisma db seed`:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```
   *(This prevents the seed script from re-running on subsequent git pushes).*

#### Option 2: Run Seed via Render Shell (Paid/Starter tier only)
If you are on a plan that provides Render Shell access:
```bash
npx prisma db seed
```

---

### D. Verify Backend Deployment

1. Once the deployment status turns green (**Live**), copy your Render service URL:
   `https://bitebox-backend-xxxx.onrender.com`
2. Test the public endpoints in your browser or with curl:

```bash
# 1. Health check (should return status: ok, database: up)
curl https://bitebox-backend-xxxx.onrender.com/api/health

# 2. Menu items list
curl https://bitebox-backend-xxxx.onrender.com/api/menu

# 3. Swagger documentation
# Open in your browser:
https://bitebox-backend-xxxx.onrender.com/api/docs
```

---

### E. Important Render Free-Tier Notes

> [!WARNING]
> **1. Spin-down after inactivity (Cold Starts):**
> On the free tier, Render puts web services to sleep after 15 minutes of inactivity. When a new request arrives, it can take **30 to 50 seconds** to spin back up. This is normal on the free tier.
>
> **2. Ephemeral Storage (SQLite):**
> On the free tier, Render container filesystems are ephemeral. Any changes written to `prod.db` or files uploaded to `uploads/` will be reset whenever the service restarts or redeploys.
>
> - **For quick demos or testing:** SQLite on the free tier works out of the box with the seed script.
> - **For persistent production use:** See [Step 4: Database Persistence & Upgrading to PostgreSQL](#step-4-database-persistence--upgrading-to-postgresql) or attach a Render Persistent Disk (Starter plan).

---

## Step 2: Deploy Frontend to Vercel

In the BiteBox frontend, API requests are made to `/api/*` (e.g. `/api/menu`, `/api/auth/login`) and uploaded images are loaded from `/api/uploads/*`.

Because the frontend is on Vercel (`https://your-app.vercel.app`) and the backend is on Render (`https://bitebox-backend-xxxx.onrender.com`), the best practice is to configure **Vercel Rewrites**.

---

### A. Configure `vercel.json` (Recommended)

Using `vercel.json` solves two problems at once:
1. **Proxying API calls**: Proxies `/api/*` requests to your Render backend without triggering browser CORS issues or broken uploaded image links (`/api/uploads/...`).
2. **SPA Routing**: Prevents `404 Not Found` when refreshing client-side routes such as `/menu`, `/contact`, `/account`, or `/admin`.

A configuration file is placed in `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-RENDER-BACKEND.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> [!IMPORTANT]
> Replace `https://YOUR-RENDER-BACKEND.onrender.com` with your actual live Render URL obtained in [Step 1.D](#d-verify-backend-deployment). Then commit and push this file to your git repository.

---

### B. Alternative: Vite Environment Variable

If you prefer calling Render directly via environment variables rather than proxying through Vercel:

1. In `frontend/src/api/http.ts`, set the base URL dynamically:
   ```typescript
   const BASE_URL = import.meta.env.VITE_API_URL 
     ? `${import.meta.env.VITE_API_URL}/api` 
     : '/api';
   ```
2. In `frontend/src/api/menu.ts`, update the upload endpoint:
   ```typescript
   const uploadUrl = import.meta.env.VITE_API_URL 
     ? `${import.meta.env.VITE_API_URL}/api/menu/upload` 
     : '/api/menu/upload';
   ```
3. In `frontend/vercel.json`, keep the SPA rewrite:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
4. Add `VITE_API_URL` in Vercel Project Settings -> Environment Variables.

*(Approach A with rewrites is recommended because it requires zero modifications to the TypeScript source code and seamlessly handles `/api/uploads/*` image URLs).*

---

### C. Import Project on Vercel

1. Log in to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** -> **Project**.
3. Import your **BiteBox** Git repository.
4. Configure the project settings:

| Setting | Value | Notes |
|---|---|---|
| **Framework Preset** | `Vite` | Auto-detected |
| **Root Directory** | `frontend` | Click **Edit** and choose `frontend` |
| **Build Command** | `npm run build` | Default (`tsc -b && vite build`) |
| **Output Directory** | `dist` | Default |
| **Install Command** | `npm install` | Default |

5. If using Approach B, expand **Environment Variables** and add `VITE_API_URL`. If using Approach A (`vercel.json`), no additional environment variables are required.
6. Click **Deploy**.

---

### D. Verify Frontend Deployment

1. Once the deployment finishes, Vercel gives you a public domain:
   `https://bitebox-xxxx.vercel.app`
2. Open the URL in your browser:
   - Check that the landing page renders with dishes and categories.
   - Click around the navigation links: `/menu`, `/contact`.
   - Refresh the page while on `/menu` to confirm client-side routing works (does not show 404).

---

## Step 3: End-to-End Verification Checklist

Perform these tests on your live Vercel URL to confirm the entire application is operational:

- [ ] **Home & Menu:** Dishes load from the backend database via `/api/menu`.
- [ ] **Cart:** Add items to cart with options/extras, change quantities, and check cart totals.
- [ ] **Customer Checkout:** Place a test order (Cash on Delivery or Card).
- [ ] **Order Tracking:** Track your order reference via `/track/<reference>`.
- [ ] **Admin Authentication:**
  - Navigate to `/login`.
  - Enter the credentials configured in Render:
    - Email: `admin@bitebox.com.np` (or your `ADMIN_EMAIL`)
    - Password: Value of `ADMIN_PASSWORD`
  - Ensure you are redirected to `/admin`.
- [ ] **Admin Features:**
  - View incoming orders in Admin Dashboard.
  - Create or edit a menu item.
  - Upload a food item image.
  - Verify that the newly uploaded image renders properly.

---

## Step 4: Database Persistence & Upgrading to PostgreSQL

By default, BiteBox uses a local SQLite database (`dev.db` / `prod.db`). On Render's Free tier, the filesystem is ephemeral and resets during reboots.

If you need persistent storage for production without paying for a Render Persistent Disk, switch Prisma from **SQLite** to **PostgreSQL** using a free managed database provider (such as [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or Render's Free PostgreSQL).

### Migration Steps:

1. **Update `backend/prisma/schema.prisma`**:
   Change the datasource provider from `sqlite` to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Generate a PostgreSQL Migration Locally**:
   ```bash
   cd backend
   # Set a temporary local or cloud Postgres connection string
   export DATABASE_URL="postgresql://user:password@host:5432/bitebox?sslmode=require"
   npx prisma migrate dev --name init_postgres
   ```

3. **Commit and Push to Git**:
   ```bash
   git add prisma/schema.prisma prisma/migrations
   git commit -m "feat: migrate prisma to postgresql"
   git push
   ```

4. **Update `DATABASE_URL` in Render Environment Variables**:
   Replace the SQLite path `file:./prod.db` with your PostgreSQL connection URL:
   ```
   DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require"
   ```

5. Re-run seeding if needed (see [Section 1.C](#c-initial-database-seeding)).

---

## Troubleshooting & FAQ

### 1. Vercel returns `404 Not Found` when refreshing a page like `/menu`
- **Cause:** Vite is a single-page app (SPA). When refreshing `/menu`, Vercel looks for a file named `/menu/index.html` on the CDN.
- **Fix:** Ensure `frontend/vercel.json` exists with the rewrite rule:
  ```json
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
  ```

### 2. Frontend shows "Cannot reach the BiteBox server. Is the API running?"
- **Cause:** Render free tier spins down after 15 minutes of inactivity (cold start takes 30-50s), or the Render URL in `frontend/vercel.json` is incorrect.
- **Fix:**
  1. Open your Render backend URL directly in a browser (`https://...onrender.com/api/health`).
  2. Wait 30 seconds for it to wake up.
  3. Verify that the URL in `frontend/vercel.json` matches your Render service domain exactly (with `https://` and without trailing slash).

### 3. Uploaded dish images return 404 or break after a few hours
- **Cause:** On Render's free tier, uploaded files in `uploads/` are stored on an ephemeral container filesystem.
- **Fix:** For long-term production image hosting:
  - Attach a Persistent Disk in Render (Starter plan or above).
  - Or integrate an object storage service such as Cloudinary, AWS S3, or Supabase Storage.

### 4. Admin login fails with `Invalid credentials`
- **Cause:** The database was not seeded, or the seed ran with default fallback credentials.
- **Fix:**
  - If you deployed with default seed variables, the fallback admin credentials are:
    - **Email:** `admin@bitebox.com.np`
    - **Password:** `admin123`
  - To re-seed with your chosen `ADMIN_EMAIL` and `ADMIN_PASSWORD`, re-run the build command with `&& npx prisma db seed`.

### 5. Render build fails with `nest: not found` or `@nestjs/cli` errors
- **Cause:** `NODE_ENV=production` prevents npm from installing devDependencies during `npm install`.
- **Fix:** Update your Render build command to force devDependencies installation during build:
  ```bash
  npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
  ```
