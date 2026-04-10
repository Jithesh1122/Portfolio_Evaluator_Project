# Developer Portfolio Evaluator

Developer Portfolio Evaluator is a full-stack MERN application that analyzes public GitHub profiles and generates interactive developer reports with scoring, charts, top repositories, caching, compare mode, and shareable report links.

## Setup

### Backend

```bash
cd server
npm install
npm run dev
```

Create `server/.env` with:

```env
MONGODB_URI=your_mongodb_uri
GITHUB_TOKEN=your_github_token
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Live Demo

- Frontend: `https://portfolio-evaluator-project.vercel.app`
- Backend: `https://portfolio-evaluator-server.onrender.com`
