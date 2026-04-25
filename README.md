# Zaraa | زرعة

**Zaraa (زرعة)** is a two‑sided gardening services marketplace (Request → Quotation → Selection → Execution → Rating).  
This repository currently contains a **production-grade UI scaffold** + **rich mock data** (frontend demo) designed to be evolved into a real SaaS.

## What’s included now (demo)
- **Roles**: Customer / Provider / Admin (switchable in sidebar for demo)
- **Core screens**: Customer home, requests, request details (quotes + selection), jobs, chat
- **Provider**: dashboard, inbox (list/map), jobs
- **Admin**: dashboard (charts with data labels), providers approvals, requests, jobs (list/kanban), ratings, categories
- **Maps**: Leaflet (OpenStreetMap tiles)
- **Design system**: RTL-first, premium tokens, micro animations, plant mascot support widget
- **Mock data**: KSA + GCC locations, multiple statuses, edge cases

## Deploy to Render (FREE) — Step by step
### 1) Rename the GitHub repo to **Zaraa**
1. Go to GitHub repo **Settings**
2. Under **Repository name**, change it to: `Zaraa`
3. Click **Rename**

Then update your local remote:

```bash
git remote set-url origin https://github.com/<YOUR_USER>/Zaraa.git
```

### 2) Push this code to GitHub
If you haven’t committed yet:

```bash
git add .
git commit -m "Rebuild as Zaraa SaaS web app scaffold"
git push
```

### 3) Create a Render Static Site
1. Open Render Dashboard → **New +** → **Static Site**
2. Connect your GitHub and pick the `Zaraa` repo
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Node Version** (if asked): `18` or `20`
4. Deploy

### 4) Ensure SPA routing works
This repo includes `static.json` so Render rewrites all routes to `index.html`.

### 5) After deployment
Render will give you a URL like:
`https://<your-site>.onrender.com`

## Moving from demo → real SaaS (next milestones)
- Add a real backend (NestJS/Express) + Postgres schema from the spec
- Auth (OTP + JWT), RBAC middleware, audit logs
- File storage (S3-compatible) for request media
- Real-time notifications (FCM) + SMS provider
- Payments/wallet ledger (out of MVP, but design is ready)

