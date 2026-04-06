import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RepoList from '../components/RepoList.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import api from '../utils/api.js';

const pageStyle = {
  minHeight: '100vh',
  padding: '40px 20px',
  background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
  color: '#0f172a',
  fontFamily: 'Segoe UI, sans-serif',
};

const containerStyle = {
  maxWidth: '900px',
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

const profileHeaderStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '20px',
};

const avatarStyle = {
  width: '110px',
  height: '110px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '4px solid #dbeafe',
};

const statGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '16px',
};

const statCardStyle = {
  backgroundColor: '#eff6ff',
  borderRadius: '16px',
  padding: '18px',
};

function Report() {
  const { username } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await api.get(`/profile/${username}`);
        setReport(data);
      } catch (requestError) {
        setError('Failed to load report.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [username]);

  if (isLoading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <section style={cardStyle}>
            <p>Loading report...</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <section style={cardStyle}>
            <p>{error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={cardStyle}>
          <div style={profileHeaderStyle}>
            <img
              src={report?.avatarUrl}
              alt={report?.name || report?.username}
              style={avatarStyle}
            />
            <div>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                GitHub Profile Report
              </p>
              <h1 style={{ margin: '6px 0 10px', fontSize: '2rem' }}>
                {report?.name || report?.username}
              </h1>
              <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
                {report?.bio || 'No bio available.'}
              </p>
            </div>
          </div>
        </section>

        <section style={statGridStyle}>
          <article style={statCardStyle}>
            <p style={{ margin: 0, color: '#475569' }}>Username</p>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.4rem' }}>
              {report?.username}
            </h2>
          </article>
          <article style={statCardStyle}>
            <p style={{ margin: 0, color: '#475569' }}>Followers</p>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.4rem' }}>
              {report?.followers ?? 0}
            </h2>
          </article>
          <article style={statCardStyle}>
            <p style={{ margin: 0, color: '#475569' }}>Repositories</p>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.4rem' }}>
              {report?.publicRepos ?? 0}
            </h2>
          </article>
        </section>

        <ScoreCard scores={report?.scores} />
        <RepoList repos={report?.topRepos} />
      </div>
    </main>
  );
}

export default Report;
