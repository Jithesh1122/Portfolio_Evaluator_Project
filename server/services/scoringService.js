const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const getLevel = (score) => {
  if (score >= 80) {
    return 'Excellent';
  }

  if (score >= 65) {
    return 'Strong';
  }

  if (score >= 45) {
    return 'Promising';
  }

  return 'Needs Improvement';
};

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

const countRecentCommits = (events = []) =>
  events.reduce((total, event) => {
    if (event.type !== 'PushEvent') {
      return total;
    }

    const daysSinceEvent = getDaysSince(event.created_at);

    if (daysSinceEvent === null || daysSinceEvent > 90) {
      return total;
    }

    return total + (event.payload?.commits?.length || 0);
  }, 0);

const calculateLongestStreak = (events = []) => {
  const uniqueDays = [...new Set(
    events
      .filter((event) => event.type === 'PushEvent')
      .map((event) => event.created_at?.split('T')[0])
      .filter(Boolean)
  )].sort();

  if (!uniqueDays.length) {
    return 0;
  }

  let currentStreak = 1;
  let longestStreak = 1;

  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = new Date(uniqueDays[index - 1]);
    const current = new Date(uniqueDays[index]);
    const differenceInDays = Math.round((current - previous) / (1000 * 60 * 60 * 24));

    if (differenceInDays === 1) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

const calculateActivityScore = (repos = [], events = []) => {
  const pushEvents = events.filter((event) => event.type === 'PushEvent').length;
  const recentCommits = countRecentCommits(events);
  const longestStreak = calculateLongestStreak(events);
  const recentlyUpdatedRepos = repos.filter((repo) => {
    const daysSinceUpdate = getDaysSince(repo.updated_at);
    return daysSinceUpdate !== null && daysSinceUpdate <= 90;
  }).length;

  const score = recentCommits * 2 + pushEvents * 3 + longestStreak * 4 + recentlyUpdatedRepos * 2;
  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    level: getLevel(normalizedScore),
    metrics: {
      recentCommits,
      pushEvents,
      longestStreak,
      recentlyUpdatedRepos,
    },
  };
};

const calculateCodeQualityScore = (repos = [], repoContentMap = {}) => {
  const nonForkRepos = repos.filter((repo) => !repo.fork);
  let readmeCount = 0;
  let licenseCount = 0;
  let topicsCount = 0;
  let testsFolderCount = 0;

  nonForkRepos.forEach((repo) => {
    const contents = repoContentMap[repo.name] || [];
    const contentNames = contents.map((item) => item.name?.toLowerCase()).filter(Boolean);

    if (contentNames.some((name) => name.startsWith('readme'))) {
      readmeCount += 1;
    }

    if (repo.license?.key) {
      licenseCount += 1;
    }

    if (Array.isArray(repo.topics) && repo.topics.length > 0) {
      topicsCount += 1;
    }

    if (contentNames.some((name) => name === 'tests' || name === '__tests__' || name === 'test')) {
      testsFolderCount += 1;
    }
  });

  const score = readmeCount * 7 + licenseCount * 5 + topicsCount * 4 + testsFolderCount * 6;
  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    level: getLevel(normalizedScore),
    metrics: {
      repoCount: nonForkRepos.length,
      readmeCount,
      licenseCount,
      topicsCount,
      testsFolderCount,
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

  const score = languages.size * 10 + topics.size * 3;
  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    level: getLevel(normalizedScore),
    metrics: {
      uniqueLanguages: languages.size,
      uniqueTopics: topics.size,
    },
  };
};

const calculateCommunityScore = (profile = {}, repos = [], starredRepos = []) => {
  const followers = profile.followers || 0;
  const totalStars = repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((total, repo) => total + (repo.forks_count || 0), 0);
  const starredCount = starredRepos.length;

  const score =
    Math.log10(totalStars + 1) * 28 +
    Math.log10(totalForks + 1) * 22 +
    Math.min(followers, 100) * 0.5 +
    Math.min(starredCount, 50) * 0.4;

  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    level: getLevel(normalizedScore),
    metrics: {
      followers,
      totalStars,
      totalForks,
      starredCount,
    },
  };
};

const calculateHiringReadiness = (profile = {}, repos = []) => {
  const hasBio = Boolean(profile.bio);
  const hasWebsite = Boolean(profile.blog);
  const hasPublicEmail = Boolean(profile.email);
  const hasPinnedStyleRepos = repos.filter((repo) => !repo.fork).length >= 4;

  const score =
    (hasBio ? 25 : 0) +
    (hasWebsite ? 25 : 0) +
    (hasPublicEmail ? 25 : 0) +
    (hasPinnedStyleRepos ? 25 : 0);

  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    level: getLevel(normalizedScore),
    metrics: {
      hasBio,
      hasWebsite,
      hasPublicEmail,
      hasPinnedRepos: hasPinnedStyleRepos,
    },
  };
};

const calculateOverallScore = (scores) => {
  const weightedScore =
    scores.activity.score * 0.25 +
    scores.codeQuality.score * 0.2 +
    scores.diversity.score * 0.2 +
    scores.community.score * 0.2 +
    scores.hiringReadiness.score * 0.15;

  const normalizedScore = clampScore(weightedScore);

  return {
    score: normalizedScore,
    level: getLevel(normalizedScore),
  };
};

const getStructuredScores = (
  profile = {},
  repos = [],
  events = [],
  repoContentMap = {},
  starredRepos = []
) => {
  const activity = calculateActivityScore(repos, events);
  const codeQuality = calculateCodeQualityScore(repos, repoContentMap);
  const diversity = calculateDiversityScore(repos);
  const community = calculateCommunityScore(profile, repos, starredRepos);
  const hiringReadiness = calculateHiringReadiness(profile, repos);
  const overall = calculateOverallScore({
    activity,
    codeQuality,
    diversity,
    community,
    hiringReadiness,
  });

  return {
    activity,
    codeQuality,
    diversity,
    community,
    hiringReadiness,
    overall,
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
