import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RadarChart from '../components/RadarChart.jsx';
import api from '../utils/api.js';

const pageStyle = {
  minHeight: '100vh',
  padding: '40px 20px',
  background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
  color: '#0f172a',
  fontFamily: 'Segoe UI, sans-serif',
};

const containerStyle = {
  maxWidth: '1000px',
  margin: '0 auto',
  display: 'grid',
  gap: '24px',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
};

const comparisonGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
};

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
      <main style={pageStyle}>
        <div style={containerStyle}>
          <section style={cardStyle}>Loading comparison...</section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <section style={cardStyle}>{error}</section>
        </div>
      </main>
    );
  }

  const [firstReport, secondReport] = compareData;

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>Compare Mode</p>
          <h1 style={{ margin: '6px 0 20px', fontSize: '2rem' }}>
            {firstReport.username} vs {secondReport.username}
          </h1>
          <RadarChart
            scores={firstReport.scores}
            compareScores={secondReport.scores}
            labels={[firstReport.username, secondReport.username]}
          />
        </section>

        <section style={comparisonGridStyle}>
          {[firstReport, secondReport].map((report) => (
            <article key={report.username} style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>{report.name || report.username}</h2>
              <p style={{ margin: '0 0 12px', color: '#475569' }}>{report.bio || 'No bio available.'}</p>
              <p style={{ margin: 0, color: '#334155' }}>
                Overall Score: {report.scores?.overall?.score ?? 0}
              </p>
            </article>
          ))}
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Category Winners</h2>
          <div style={comparisonGridStyle}>
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
                  style={{
                    ...cardStyle,
                    backgroundColor: winner === 'Tie' ? '#ffffff' : '#ecfdf5',
                    border: winner === 'Tie' ? '1px solid #e2e8f0' : '1px solid #86efac',
                  }}
                >
                  <p style={{ margin: 0, color: '#475569' }}>{category.label}</p>
                  <h3 style={{ margin: '8px 0 0' }}>{winner}</h3>
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
