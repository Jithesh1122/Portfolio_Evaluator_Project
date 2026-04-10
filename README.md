# Developer Portfolio Evaluator

Developer Portfolio Evaluator is a full-stack MERN application that analyzes any public GitHub profile and generates a detailed score card covering activity, code quality signals, project diversity, community impact, and hiring readiness using freely available GitHub API data.

Users enter a GitHub username and receive an interactive report with charts, top repositories, caching, compare mode, and a shareable report URL.

## Project Overview

- Project Type: Fullstack Web Application (MERN)
- Duration: 3 weeks
- Frontend Live URL: `https://portfolio-evaluator-project.vercel.app`
- Backend Live URL: `https://portfolio-evaluator-server.onrender.com`

## Tech Stack

| Layer | Tool / Library | Purpose |
| --- | --- | --- |
| Frontend | React 18 + Vite | UI, routing, state |
| Frontend | React Router v6 | Client-side routing |
| Frontend | Chart.js | Heatmaps, radar charts, bar charts |
| Frontend | Axios | HTTP client |
| Backend | Node.js + Express | REST API server |
| Backend | Octokit (`@octokit/rest`) | GitHub API calls |
| Backend | node-cron | Cache expiry jobs |
| Backend | dotenv | Environment variables |
| Database | MongoDB Atlas | Store cached reports |
| Database | Mongoose | ODM / schema validation |
| Deploy FE | Vercel | Frontend hosting |
| Deploy BE | Render | Backend hosting |
| API | GitHub REST API v3 | Profile and repository data |

## Features

### GitHub Username Search

- Enter any GitHub username and fetch live profile data
- Show avatar, bio, join date, followers, and public repos
- Handle invalid usernames with a friendly error message

### Scoring Engine

- Activity Score
- Code Quality Signals
- Project Diversity
- Community Impact
- Hiring Readiness

### Visual Score Card

- Overall score out of 100 with a circular progress ring
- Radar chart showing all 5 category scores
- Contribution heatmap
- Language distribution chart
- Top 6 repositories with stars, forks, and language

### Shareable Report URL

- Each report lives at `/report/:username`
- Copy-link button for one-click sharing
- Report cached in MongoDB for 24 hours
- Open Graph meta tags for link previews

### Compare Mode

- Compare two usernames side by side
- Radar chart overlay for both users
- Winner highlight per category

## Folder Structure

```text
portfolio-evaluator/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeatMap.jsx
│   │   │   ├── RadarChart.jsx
│   │   │   ├── RepoList.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Report.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── cache.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Report.js
│   ├── routes/
│   │   └── profileRoutes.js
│   ├── services/
│   │   ├── githubService.js
│   │   └── scoringService.js
│   ├── .env
│   ├── app.js
│   └── package.json
└── README.md
```

## Environment Variables

Create a `.env` file inside the `server/` folder:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio_eval
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
JWT_SECRET=your_random_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Notes:

- Add `.env` files to `.gitignore`
- Never commit secrets to GitHub
- `JWT_SECRET` is optional unless auth is added

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Server health check |
| GET | `/api/profile/:username` | Fetch and score a GitHub profile |
| GET | `/api/profile/:username/cached` | Return cached report if available |
| GET | `/api/compare?u1=:u1&u2=:u2` | Compare two GitHub profiles |

## Scoring Algorithm

All scores are computed in `server/services/scoringService.js` using raw GitHub API data.

| Category | Weight | GitHub Data Used | Scoring Basis |
| --- | --- | --- | --- |
| Activity | 25% | commits, push dates, contribution activity | recent commits, push frequency, streak consistency |
| Code Quality | 20% | README, license, topics, folder names | points for README, license, topics, tests/docs presence |
| Diversity | 20% | languages per repo, repo topics | language variety and project type/category spread |
| Community | 20% | stars, forks, followers | community engagement and popularity signals |
| Hiring Readiness | 15% | bio, website, email, pinned repos | profile completeness and presentation readiness |

## MongoDB Schema

Cached reports are stored in a single collection using `server/models/Report.js`.

Stored data includes:

- `username`
- `avatarUrl`
- `name`
- `bio`
- `followers`
- `publicRepos`
- `scores`
- `topRepos`
- `languages`
- `heatmapData`
- `shareUrl`
- `cachedAt`
- `expiresAt`

The `expiresAt` field uses a TTL index so cached reports are auto-deleted after 24 hours.

## GitHub API Endpoints Used

- `GET /users/:username`
- `GET /users/:username/repos?per_page=100`
- `GET /users/:username/events/public`
- `GET /repos/:owner/:repo/contents`
- `GET /users/:username/starred`

## Setup Instructions

### Prerequisites

- Node.js v18+
- Git
- VS Code
- MongoDB Compass (optional)

### Clone and Install

```bash
git clone https://github.com/your-org/portfolio-evaluator.git
cd portfolio-evaluator
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### Create Free Accounts

- MongoDB Atlas
- GitHub Personal Access Token
- Vercel
- Render

### Run Locally

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Deployment

### Frontend on Vercel

- Root Directory: `client`
- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run vercel-build`
- Output Directory: `dist`
- Environment Variable:

```env
VITE_API_URL=https://portfolio-evaluator-server.onrender.com/api
```

### Backend on Render

- Root Directory: `server`
- Runtime: `Node`
- Build Command: `npm run render-build`
- Start Command: `npm run render-start`
- Environment Variables:

```env
MONGODB_URI=your_mongodb_uri
GITHUB_TOKEN=your_github_token
PORT=5000
CLIENT_URL=https://portfolio-evaluator-project.vercel.app
NODE_ENV=production
```

## Must-Have Checklist

- GitHub username search
- All 5 scoring categories computed
- Score card with overall score
- Top repos display
- Language distribution chart
- Shareable report URL
- MongoDB caching for 24 hours
- Deployed on Vercel and Render

## Submission Checklist

### Code and Repository

- Public GitHub repository
- README with project description, setup steps, and live demo link
- `.env` files not committed
- No hardcoded secrets in code

### Functionality

- Search works for valid GitHub usernames
- All 5 score categories are computed and displayed
- Shareable URL loads the report directly
- Error handling works for invalid usernames and API failures
- MongoDB caching confirmed

### Deployment

- Frontend live on Vercel
- Backend live on Render
- Environment variables used in both deployments
- CORS configured to allow frontend origin

### Code Quality

- Folder structure follows the spec
- API logic centralized in `githubService.js`
- Scoring logic centralized in `scoringService.js`
- No production debugging logs intentionally left in application flow

## Live Demo

- Frontend: `https://portfolio-evaluator-project.vercel.app`
- Backend: `https://portfolio-evaluator-server.onrender.com`

## Useful Resources

- GitHub REST API Docs: `https://docs.github.com/en/rest`
- Octokit SDK: `https://github.com/octokit/octokit.js`
- MongoDB Atlas Docs: `https://www.mongodb.com/docs/atlas/getting-started`
- Chart.js Docs: `https://www.chartjs.org/docs/latest`
- Vercel Docs: `https://vercel.com/docs`
- Render Docs: `https://render.com/docs/deploy-node-express-app`
- React Router Docs: `https://reactrouter.com/en/main`
- Mongoose Docs: `https://mongoosejs.com/docs/guide.html`
