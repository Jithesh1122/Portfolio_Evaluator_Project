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
- Environment variable: `VITE_API_URL`

### Backend on Render

- Root directory: `server`
- Build command: `npm run render-build`
- Start command: `npm run render-start`
- Environment variables:
  - `MONGODB_URI`
  - `GITHUB_TOKEN`
  - `PORT`
  - `CLIENT_URL`
  - `NODE_ENV=production`
