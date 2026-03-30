import Report from '../models/Report.js';
import {
  getUserProfile,
  getUserRepos,
  getUserEvents,
} from '../services/githubService.js';
import { getStructuredScores } from '../services/scoringService.js';

const REPORT_TTL_IN_MS = 24 * 60 * 60 * 1000;

const getTopRepos = (repos = []) =>
  [...repos]
    .sort((firstRepo, secondRepo) => {
      if (secondRepo.stargazers_count !== firstRepo.stargazers_count) {
        return secondRepo.stargazers_count - firstRepo.stargazers_count;
      }

      return secondRepo.forks_count - firstRepo.forks_count;
    })
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || '',
    }));

const getLanguages = (repos = []) =>
  [...new Set(repos.map((repo) => repo.language).filter(Boolean))];

const getHeatmapData = (events = []) => {
  const eventCounts = new Map();

  events.forEach((event) => {
    const dateKey = new Date(event.created_at).toISOString().split('T')[0];
    eventCounts.set(dateKey, (eventCounts.get(dateKey) || 0) + 1);
  });

  return [...eventCounts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((firstEntry, secondEntry) => firstEntry.date.localeCompare(secondEntry.date));
};

const buildShareUrl = (username) => `/share/${username}`;

const buildReportPayload = (profile, repos, events) => ({
  username: profile.login,
  avatarUrl: profile.avatar_url || '',
  name: profile.name || '',
  bio: profile.bio || '',
  followers: profile.followers || 0,
  publicRepos: profile.public_repos || 0,
  scores: getStructuredScores(profile, repos, events),
  topRepos: getTopRepos(repos),
  languages: getLanguages(repos),
  heatmapData: getHeatmapData(events),
  shareUrl: buildShareUrl(profile.login),
  cachedAt: new Date(),
  expiresAt: new Date(Date.now() + REPORT_TTL_IN_MS),
});

const fetchGitHubData = async (username) => {
  const [profile, repos, events] = await Promise.all([
    getUserProfile(username),
    getUserRepos(username),
    getUserEvents(username),
  ]);

  return { profile, repos, events };
};

const generateAndStoreReport = async (username) => {
  const { profile, repos, events } = await fetchGitHubData(username);
  const reportPayload = buildReportPayload(profile, repos, events);

  return Report.findOneAndUpdate({ username: profile.login }, reportPayload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
};

const getProfileReport = async (req, res, next) => {
  try {
    const { username } = req.params;
    const report = await generateAndStoreReport(username);

    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

const compareProfiles = async (req, res, next) => {
  try {
    const { u1, u2 } = req.query;

    if (!u1 || !u2) {
      res.status(400);
      throw new Error('Both u1 and u2 query parameters are required');
    }

    const [firstReport, secondReport] = await Promise.all([
      generateAndStoreReport(u1),
      generateAndStoreReport(u2),
    ]);

    res.status(200).json({
      users: [firstReport, secondReport],
    });
  } catch (error) {
    next(error);
  }
};

export { compareProfiles, getProfileReport };
