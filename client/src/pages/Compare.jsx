import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RadarChart from '../components/RadarChart.jsx';
import api from '../utils/api.js';

const categories = [
  { key: 'activity', label: 'Activity' },
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'diversity', label: 'Diversity' },
  { key: 'community', label: 'Community' },
  { key: 'hiringReadiness', label: 'Hiring Readiness' },
];

function Compare() {
  const [searchParams] = useSearchParams();
  const [compareData, setCompareData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const firstUser = searchParams.get('u1') || '';
  const secondUser = searchParams.get('u2') || '';

  useEffect(() => {
    let isActive = true;

    const fetchComparison = async () => {
      if (!firstUser || !secondUser) {
        if (isActive) {
          setError('Please provide both usernames to compare.');
          setIsLoading(false);
        }
        return;
      }

      try {
        if (isActive) {
          setIsLoading(true);
          setError('');
        }

        const { data } = await api.get(`/compare?u1=${firstUser}&u2=${secondUser}`);

        if (isActive) {
          setCompareData(data.users || []);
        }
      } catch (requestError) {
        if (isActive) {
          setError('Failed to load comparison report.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchComparison();

    return () => {
      isActive = false;
    };
  }, [firstUser, secondUser]);

  if (isLoading) {
    return (
      <main className="app-shell page">
        <div className="page__container">
          <section className="loading-panel loading-panel--compare">
            <div className="loading-panel__visual" aria-hidden="true">
              <span className="loading-panel__orb loading-panel__orb--one" />
              <span className="loading-panel__orb loading-panel__orb--two" />
              <span className="loading-panel__ring" />
            </div>
            <div className="loading-panel__copy">
              <p className="loading-panel__eyebrow">Preparing Compare View</p>
              <h2 className="loading-panel__title">Loading comparison...</h2>
              <p className="loading-panel__text">
                Syncing both profiles, category scores, and the shared radar view.
              </p>
            </div>
            <div className="loading-panel__bars" aria-hidden="true">
              <span className="loading-panel__bar loading-panel__bar--long" />
              <span className="loading-panel__bar loading-panel__bar--medium" />
              <span className="loading-panel__bar loading-panel__bar--short" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell page">
        <div className="page__container">
          <section className="error-panel">{error}</section>
        </div>
      </main>
    );
  }

  const [firstReport, secondReport] = compareData;

  return (
    <main className="app-shell page">
      <div className="page__container">
        <section className="panel fade-in">
          <p className="panel__eyebrow">Compare Mode</p>
          <h1 className="panel__title">
            {firstReport.username} vs {secondReport.username}
          </h1>
          <p className="panel__text" style={{ marginTop: 0 }}>
            Compare score patterns across activity, code quality, diversity, community impact,
            and hiring readiness.
          </p>
          <RadarChart
            scores={firstReport.scores}
            compareScores={secondReport.scores}
            labels={[firstReport.username, secondReport.username]}
          />
        </section>

        <section className="compare-grid fade-in stagger-1">
          {[firstReport, secondReport].map((report) => (
            <article key={report.username} className="panel compare-summary">
              <p className="panel__eyebrow">Candidate Snapshot</p>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '6px' }}>
                {report.name || report.username}
              </h2>
              <p className="panel__text" style={{ margin: 0 }}>{report.bio || 'No bio available.'}</p>
              <p className="compare-summary__score">
                Overall Score: {report.scores?.overall?.score ?? 0}
              </p>
            </article>
          ))}
        </section>

        <section className="panel fade-in stagger-2">
          <p className="panel__eyebrow">Winner Snapshot</p>
          <h2 className="section-title" style={{ fontSize: '2.2rem' }}>Category Winners</h2>
          <div className="winner-grid">
            {categories.map((category) => {
              const firstScore = firstReport.scores?.[category.key]?.score ?? 0;
              const secondScore = secondReport.scores?.[category.key]?.score ?? 0;
              const winner =
                firstScore === secondScore
                  ? 'Tie'
                  : firstScore > secondScore
                    ? firstReport.username
                    : secondReport.username;

              return (
                <article
                  key={category.key}
                  className={`winner-card ${winner === 'Tie' ? 'winner-card--tie' : 'winner-card--lead'}`}
                >
                  <p className="metric-card__label">{category.label}</p>
                  <h3 className="section-title" style={{ fontSize: '1.6rem', marginBottom: 0 }}>
                    {winner}
                  </h3>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Compare;
