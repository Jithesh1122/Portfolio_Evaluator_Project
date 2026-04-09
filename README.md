# Portfolio Evaluator

Portfolio Evaluator is a full-stack MERN project that analyzes public GitHub profiles and turns them into shareable developer reports with scoring, charts, caching, and compare mode.

## Stack

- React 18 + Vite
- React Router v6
- Axios
- Chart.js
- Node.js + Express
- Octokit
- MongoDB Atlas + Mongoose

## Features

- GitHub username search
- Profile report at `/report/:username`
- Five scoring categories plus overall score
- Radar chart, heat map, and language distribution chart
- Top repositories section
- Shareable report URL with copy button
- MongoDB report caching with TTL
- Compare mode at `/compare?u1=&u2=`

## Run Locally

### Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

### `server/.env`

- `MONGODB_URI`
- `GITHUB_TOKEN`
- `PORT`
- `CLIENT_URL`
- `NODE_ENV`

### `client/.env`

- `VITE_API_URL`

## API Endpoints

- `GET /api/health`
- `GET /api/profile/:username`
- `GET /api/profile/:username/cached`
- `GET /api/compare?u1=:u1&u2=:u2`

## Deployment

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run vercel-build`
- Output directory: `dist`
- Install command: `npm install`
- Environment variable: `VITE_API_URL=https://your-server-name.onrender.com/api`
- Project settings:
  - Framework preset: `Vite`
  - Node version: `18+`
  - The included `client/vercel.json` handles SPA rewrites for routes like `/report/:username` and `/compare`

### Backend on Render

- Root directory: `server`
- Build command: `npm run render-build`
- Start command: `npm run render-start`
- Runtime: `Node`
- Node version: `18+`
- Environment variables:
  - `MONGODB_URI`
  - `GITHUB_TOKEN`
  - `PORT`
  - `CLIENT_URL`
  - `NODE_ENV=production`

### Production Notes

- Set `CLIENT_URL` on Render to your deployed Vercel frontend URL.
- `CLIENT_URL` can be a comma-separated list if you want to allow multiple origins.
  Example:
  `https://your-client-domain.vercel.app,https://your-preview-domain.vercel.app`
- Set `VITE_API_URL` on Vercel to your Render backend URL with `/api` at the end.
- In development, the server still allows `http://localhost:5173` automatically.
