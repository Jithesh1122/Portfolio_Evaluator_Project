import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeatMap from '../components/HeatMap.jsx';
import LanguageChart from '../components/LanguageChart.jsx';
import RadarChart from '../components/RadarChart.jsx';
import RepoList from '../components/RepoList.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import api from '../utils/api.js';

const upsertMetaTag = (attribute, value, content) => {
  const selector = `meta[${attribute}="${value}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

function Report() {
  const { username } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await api.get(`/profile/${username}`);
        setReport(data);
      } catch (requestError) {
        setError(
          requestError.response?.status === 404
            ? 'GitHub user not found. Please check the username and try again.'
            : 'Failed to load report. Please try again in a moment.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [username]);

  useEffect(() => {
    if (!report) {
      document.title = 'Portfolio Evaluator';
      return;
    }

    const displayName = report.name || report.username;
    const description = `View ${displayName}'s GitHub portfolio report, scores, and repository highlights.`;

    document.title = `${displayName} | Portfolio Evaluator`;
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('property', 'og:title', `${displayName} | Portfolio Evaluator`);
    upsertMetaTag('property', 'og:description', description);
  }, [report]);

  const handleCopyUrl = async () => {
    const shareUrl = `${window.location.origin}/report/${username}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Report URL copied to clipboard.');
    } catch (copyError) {
      setShareMessage('Unable to copy the URL automatically.');
    }
  };

  if (isLoading) {
    return (
      <main className="app-shell page">
        <div className="page__container">
          <section className="loading-panel">
            <p>Loading report...</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell page">
        <div className="page__container">
          <section className="error-panel">
            <p>{error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell page">
      <div className="page__container report-grid">
        <section className="panel fade-in">
          <div className="profile-hero">
            <div className="avatar-frame">
              <img
                src={report?.avatarUrl}
                alt={report?.name || report?.username}
                className="avatar"
              />
            </div>
            <div>
              <p className="profile-badge">GitHub Profile Report</p>
              <h1 className="panel__title" style={{ marginBottom: '10px' }}>
                {report?.name || report?.username}
              </h1>
              <p className="panel__text" style={{ margin: 0 }}>
                {report?.bio || 'No bio available.'}
              </p>
              <div className="profile-meta">
                <span>Joined {report?.joinDate ? new Date(report.joinDate).toLocaleDateString() : 'N/A'}</span>
                <span>Website {report?.websiteUrl || 'Not provided'}</span>
                <span>Email {report?.publicEmail || 'Not provided'}</span>
              </div>
              <button type="button" className="button-dark" style={{ marginTop: '18px' }} onClick={handleCopyUrl}>
                Copy Report URL
              </button>
              {shareMessage ? <p className="feedback-success" style={{ marginTop: '10px' }}>{shareMessage}</p> : null}
            </div>
          </div>
        </section>

        <section className="stats-grid fade-in stagger-1">
          <article className="metric-card">
            <p className="metric-card__label">Username</p>
            <h2 className="metric-card__value">{report?.username}</h2>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">Followers</p>
            <h2 className="metric-card__value">{report?.followers ?? 0}</h2>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">Repositories</p>
            <h2 className="metric-card__value">{report?.publicRepos ?? 0}</h2>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">Shareable Link</p>
            <h2 className="metric-card__value">{report?.shareUrl ? 'Ready' : 'Pending'}</h2>
          </article>
        </section>

        <div className="fade-in stagger-2">
          <ScoreCard scores={report?.scores} />
        </div>
        <div className="chart-grid fade-in stagger-2">
          <RadarChart scores={report?.scores} />
          <LanguageChart languages={report?.languages} />
        </div>
        <div className="fade-in stagger-3">
          <HeatMap heatmapData={report?.heatmapData} />
        </div>
        <div className="fade-in stagger-3">
          <RepoList repos={report?.topRepos} />
        </div>
      </div>
    </main>
  );
}

export default Report;
