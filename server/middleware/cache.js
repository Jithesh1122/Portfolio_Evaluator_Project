import Report from '../models/Report.js';

const isStructuredLanguage = (language) =>
  Boolean(language) &&
  typeof language === 'object' &&
  typeof language.name === 'string' &&
  typeof language.percent === 'number';

const isCacheUsable = (report) => {
  if (!report) {
    return false;
  }

  const hasOverallScore = typeof report.scores?.overall?.score === 'number';
  const hasHiringReadiness = typeof report.scores?.hiringReadiness?.score === 'number';
  const hasStructuredLanguages =
    Array.isArray(report.languages) &&
    report.languages.length > 0 &&
    report.languages.every(isStructuredLanguage);
  const hasJoinDate = Boolean(report.joinDate);

  return hasOverallScore && hasHiringReadiness && hasStructuredLanguages && hasJoinDate;
};

const findCachedReport = async (username) => {
  if (!username) {
    return null;
  }

  const report = await Report.findOne({
    username: { $regex: `^${username.trim()}$`, $options: 'i' },
  });

  return isCacheUsable(report) ? report : null;
};

const cacheReport = async (req, res, next) => {
  try {
    const username = req.params.username?.trim();

    if (!username) {
      return next();
    }

    const cachedReport = await findCachedReport(username);

    if (cachedReport) {
      req.cachedReport = cachedReport;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { findCachedReport };
export default cacheReport;
