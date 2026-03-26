const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const getDaysSince = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const timestamp = new Date(dateValue).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return (Date.now() - timestamp) / millisecondsPerDay;
};

const calculateActivityScore = (repos = [], events = []) => {
  const pushEvents = events.filter((event) => event.type === 'PushEvent').length;
  const recentRepos = repos.filter((repo) => {
    const daysSinceUpdate = getDaysSince(repo.updated_at);
    return daysSinceUpdate !== null && daysSinceUpdate <= 90;
  }).length;

  const score = pushEvents * 5 + recentRepos * 7;

  return {
    score: clampScore(score),
    metrics: {
      pushEvents,
      recentlyUpdatedRepos: recentRepos,
    },
  };
};

const calculateCodeQualityScore = (repos = []) => {
  const nonForkRepos = repos.filter((repo) => !repo.fork);
  const reposWithDescriptions = nonForkRepos.filter((repo) => repo.description).length;
  const reposWithTopics = nonForkRepos.filter(
    (repo) => Array.isArray(repo.topics) && repo.topics.length > 0
  ).length;
  const reposWithHomepages = nonForkRepos.filter((repo) => repo.homepage).length;

  const score =
    reposWithDescriptions * 8 +
    reposWithTopics * 6 +
    reposWithHomepages * 6;

  return {
    score: clampScore(score),
    metrics: {
      nonForkRepos: nonForkRepos.length,
      reposWithDescriptions,
      reposWithTopics,
      reposWithHomepages,
    },
  };
};

const calculateDiversityScore = (repos = []) => {
  const languages = new Set(
    repos
      .map((repo) => repo.language)
      .filter(Boolean)
      .map((language) => language.toLowerCase())
  );

  const topics = new Set();

  repos.forEach((repo) => {
    if (Array.isArray(repo.topics)) {
      repo.topics.forEach((topic) => topics.add(topic.toLowerCase()));
    }
  });

  const score = languages.size * 12 + topics.size * 2;

  return {
    score: clampScore(score),
    metrics: {
      uniqueLanguages: languages.size,
      uniqueTopics: topics.size,
    },
  };
};

const calculateCommunityScore = (profile = {}, repos = [], events = []) => {
  const followers = profile.followers || 0;
  const publicRepos = profile.public_repos || 0;
  const publicGists = profile.public_gists || 0;
  const watchEvents = events.filter((event) => event.type === 'WatchEvent').length;
  const forkedRepos = repos.filter((repo) => repo.fork).length;

  const score =
    followers * 2 +
    publicRepos * 2 +
    publicGists * 3 +
    watchEvents * 4 +
    forkedRepos * 3;

  return {
    score: clampScore(score),
    metrics: {
      followers,
      publicRepos,
      publicGists,
      watchEvents,
      forkedRepos,
    },
  };
};

const calculateHiringReadiness = (profile = {}, repos = [], events = []) => {
  const activity = calculateActivityScore(repos, events);
  const codeQuality = calculateCodeQualityScore(repos);
  const diversity = calculateDiversityScore(repos);
  const community = calculateCommunityScore(profile, repos, events);

  const weightedScore =
    activity.score * 0.3 +
    codeQuality.score * 0.3 +
    diversity.score * 0.2 +
    community.score * 0.2;

  let level = 'Needs Improvement';

  if (weightedScore >= 75) {
    level = 'Strong';
  } else if (weightedScore >= 50) {
    level = 'Promising';
  }

  return {
    score: clampScore(weightedScore),
    level,
  };
};

const getStructuredScores = (profile = {}, repos = [], events = []) => {
  const activity = calculateActivityScore(repos, events);
  const codeQuality = calculateCodeQualityScore(repos);
  const diversity = calculateDiversityScore(repos);
  const community = calculateCommunityScore(profile, repos, events);
  const hiringReadiness = calculateHiringReadiness(profile, repos, events);

  return {
    activity,
    codeQuality,
    diversity,
    community,
    hiringReadiness,
  };
};

export {
  calculateActivityScore,
  calculateCodeQualityScore,
  calculateDiversityScore,
  calculateCommunityScore,
  calculateHiringReadiness,
  getStructuredScores,
};
