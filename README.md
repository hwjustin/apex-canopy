# apex-canopy — Canopy Meetup

A founder directory + meetup board for the Canopy accelerator cohort. Post your project, share contacts, browse by city or interest, react, and connect.

Deployed at **canopy.apexnetwork.app**. Backend is the shared [apex-demo-api](https://github.com/hwjustin/apex-demo-api) at `/api/canopy/*`.

## Local dev

```bash
pnpm install
pnpm dev   # http://localhost:5173 — proxies /api to localhost:3001
```

Run apex-demo-api alongside on port 3001 with `CANOPY_JWT_SECRET` and `BLOB_READ_WRITE_TOKEN` set.

## Stack

Vite + React 19 + Tailwind v4 + shadcn/ui + wouter + framer-motion. Logo uploads go to Vercel Blob via `@vercel/blob/client`.

## Env vars (Vercel)

- `VITE_RAILWAY_API_URL` — apex-demo-api base (`https://api.apexnetwork.app` for prod, prepub URL for staging)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob store token
