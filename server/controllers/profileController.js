import Report from '../models/Report.js';
import {
  getRepoContents,
  getUserProfile,
  getUserRepos,
  getUserStarredRepos,
  getUserEvents,
} from '../services/githubService.js';
import { getStructuredScores } from '../services/scoringService.js';
import { findCachedReport } from '../middleware/cache.js';

const REPORT_TTL_IN_MS = 24 * 60 * 60 * 1000;

const getTopRepos = (repos = []) =>
  [...repos]
    .sort((firstRepo, secondRepo) => {
      if (secondRepo.stargazers_count !== firstRepo.stargazers_count) {
        return secondRepo.stargazers_count - firstRepo.stargazers_count;
      }

      return secondRepo.forks_count - firstRepo.forks_count;
    })
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || '',
    }));

const getLanguages = (repos = []) => {
  const languageCounts = repos.reduce((accumulator, repo) => {
    if (!repo.language) {
      return accumulator;
    }

    accumulator[repo.language] = (accumulator[repo.language] || 0) + 1;
    return accumulator;
  }, {});

  const totalTaggedRepos = Object.values(languageCounts).reduce(
    (total, count) => total + count,
    0
  );

  return Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      percent: totalTaggedRepos ? Math.round((count / totalTaggedRepos) * 100) : 0,
      count,
    }))
    .sort((firstLanguage, secondLanguage) => secondLanguage.count - firstLanguage.count);
};

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

const buildShareUrl = (username) => `/report/${username}`;

const buildReportPayload = (profile, repos, events, repoContentMap, starredRepos) => ({
  username: profile.login,
  avatarUrl: profile.avatar_url || '',
  name: profile.name || '',
  bio: profile.bio || '',
  joinDate: profile.created_at || null,
  websiteUrl: profile.blog || '',
  publicEmail: profile.email || '',
  followers: profile.followers || 0,
  publicRepos: profile.public_repos || 0,
  scores: getStructuredScores(profile, repos, events, repoContentMap, starredRepos),
  topRepos: getTopRepos(repos),
  languages: getLanguages(repos),
  heatmapData: getHeatmapData(events),
  shareUrl: buildShareUrl(profile.login),
  cachedAt: new Date(),
  expiresAt: new Date(Date.now() + REPORT_TTL_IN_MS),
});

const fetchGitHubData = async (username) => {
  const [profile, repos, events, starredReposResult] = await Promise.all([
    getUserProfile(username),
    getUserRepos(username),
    getUserEvents(username),
    getUserStarredRepos(username).catch(() => []),
  ]);

  const starredRepos = Array.isArray(starredReposResult) ? starredReposResult : [];

  const repoContents = await Promise.all(
    repos
      .filter((repo) => !repo.fork)
      .slice(0, 20)
      .map(async (repo) => [
        repo.name,
        await getRepoContents(profile.login, repo.name).catch(() => []),
      ])
  );

  const repoContentMap = Object.fromEntries(repoContents);

  return { profile, repos, events, repoContentMap, starredRepos };
};

const generateAndStoreReport = async (username) => {
  const { profile, repos, events, repoContentMap, starredRepos } = await fetchGitHubData(username);
  const reportPayload = buildReportPayload(
    profile,
    repos,
    events,
    repoContentMap,
    starredRepos
  );

  return Report.findOneAndUpdate({ username: profile.login }, reportPayload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
};

const getProfileReport = async (req, res, next) => {
  try {
    if (req.cachedReport) {
      return res.status(200).json(req.cachedReport);
    }

    const { username } = req.params;
    const report = await generateAndStoreReport(username);

    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

const getCachedProfileReport = async (req, res, next) => {
  try {
    if (req.cachedReport) {
      return res.status(200).json(req.cachedReport);
    }

    const cachedReport = await findCachedReport(req.params.username);

    if (!cachedReport) {
      res.status(404);
      throw new Error('Cached report not found');
    }

    return res.status(200).json(cachedReport);
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

    const [firstCachedReport, secondCachedReport] = await Promise.all([
      findCachedReport(u1),
      findCachedReport(u2),
    ]);

    const [firstReport, secondReport] = await Promise.all([
      firstCachedReport || generateAndStoreReport(u1),
      secondCachedReport || generateAndStoreReport(u2),
    ]);

    res.status(200).json({
      users: [firstReport, secondReport],
    });
  } catch (error) {
    next(error);
  }
};

export { compareProfiles, getCachedProfileReport, getProfileReport };
