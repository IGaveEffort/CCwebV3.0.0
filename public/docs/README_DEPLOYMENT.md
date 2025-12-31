# Campus Cliques Platform — Next.js + Supabase (MVP)

This repository is a working scaffold for:
- Student & employer accounts (Supabase Auth)
- Job/gig posting
- Applications dashboard
- Messaging that unlocks once a student is accepted
- Tasks/deliverables page (link submissions + optional Storage uploads)
- Pricing page
- Admin panel (role = admin)

## 1) Local setup

### Prereqs
- Node.js 18+ (or 20+)
- A Supabase project
- Upstash Redis database (for rate limiting)

### Install
```bash
cp .env.example .env.local
npm install
npm run dev
```

### Env vars
Fill `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- (optional) `SUPABASE_SERVICE_ROLE_KEY` for admin-only server actions in the future.

## 2) Supabase configuration

### Create schema + policies
1. In Supabase Dashboard → **SQL Editor**
2. Paste and run `public/docs/SQL_SCHEMA.sql`

### Auth
- Enable email/password auth
- Optional: turn on email confirmations

### Storage (optional uploads)
- Create a private bucket named `deliverables`
- Add policies for signed upload/download if you implement file uploads.
  (This MVP currently uses link submissions only.)

## 3) Rate limiting (required)

Every API endpoint is rate-limited in **two layers**:
1) `middleware.ts` applies to `/api/*`
2) `withApiGuards()` also rate-limits per-route and enforces auth

This requires Upstash env vars to be configured in production.

Suggested production values:
- 60 req / minute / IP / endpoint (change in `lib/rate-limit.ts`)

## 4) Publishing / deployment (GitHub + Supabase + Vercel)

### A) Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### B) Supabase
- Create a Supabase project
- Run `public/docs/SQL_SCHEMA.sql`
- Copy `Project URL` + `anon public` key into Vercel env vars

### C) Upstash Redis (rate limiting)
- Create Redis database at Upstash
- Copy REST URL + REST token into Vercel env vars

### D) Deploy frontend + API on Vercel
Why Vercel: Next.js API routes + middleware deploy cleanly.

Steps:
1. Import the GitHub repo into Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL
3. Deploy

### E) Supabase Auth redirect URLs
In Supabase Dashboard → Auth → URL Configuration:
- Site URL: your Vercel URL
- Redirect URLs: add:
  - `http://localhost:3000`
  - `https://<your-vercel-app>.vercel.app`

## 5) Admin role
To create an admin, set `role` to `admin` in the `profiles` table for that user (Supabase SQL Editor):
```sql
update public.profiles set role='admin' where email='you@example.com';
```

## 6) Security checklist
- All API keys are in environment variables.
- Every `/api/*` endpoint is rate limited.
- Inputs validated with Zod schemas on every write endpoint.
- Supabase RLS policies restrict reads/writes by role and ownership.
- Avoid using `SUPABASE_SERVICE_ROLE_KEY` unless required (server-only).

## 7) Next steps (production-grade)
- Stripe billing + webhooks (also rate limit webhook endpoints)
- File uploads: signed URLs, virus scanning, and size/type validation
- Audit logging (admin actions)
- Notifications (email + in-app)
- More granular rate limits by user id + IP
