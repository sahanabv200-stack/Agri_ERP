# Frontend Deployment (Vercel)

Use these Vercel settings for SPA routing with React Router (`BrowserRouter`):

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` is in this folder and rewrites all routes to `index.html`, so deep links like `/login`, `/dashboard`, `/masters/...` load the SPA correctly.
