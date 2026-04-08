import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';

const pageStyle = {
  minHeight: '100vh',
  padding: '48px 20px',
  background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 60%, #e2e8f0 100%)',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#0f172a',
};

const containerStyle = {
  maxWidth: '980px',
  margin: '0 auto',
  display: 'grid',
  gap: '24px',
};

const heroCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  padding: '32px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
};

const compareGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px',
  marginTop: '16px',
};

function Home() {
  const [userOne, setUserOne] = useState('');
  const [userTwo, setUserTwo] = useState('');
  const navigate = useNavigate();

  const handleCompareSubmit = (event) => {
    event.preventDefault();

    if (!userOne.trim() || !userTwo.trim()) {
      return;
    }

    navigate(`/compare?u1=${userOne.trim()}&u2=${userTwo.trim()}`);
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={heroCardStyle}>
          <p style={{ margin: 0, color: '#2563eb', fontWeight: 700 }}>Developer Portfolio Evaluator</p>
          <h1 style={{ margin: '8px 0 12px', fontSize: '2.4rem' }}>
            Turn any public GitHub profile into a shareable hiring report.
          </h1>
          <p style={{ margin: '0 0 24px', color: '#475569', lineHeight: 1.7 }}>
            Search a developer profile, review the score breakdown, inspect language and
            activity charts, and compare two candidates side by side.
          </p>
          <SearchBar />
        </section>

        <section style={heroCardStyle}>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>Bonus Compare Mode</p>
          <h2 style={{ margin: '6px 0 12px', fontSize: '1.8rem' }}>Compare Two GitHub Users</h2>
          <form onSubmit={handleCompareSubmit}>
            <div style={compareGridStyle}>
              <input
                type="text"
                value={userOne}
                onChange={(event) => setUserOne(event.target.value)}
                placeholder="First username"
                style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #cbd5e1' }}
              />
              <input
                type="text"
                value={userTwo}
                onChange={(event) => setUserTwo(event.target.value)}
                placeholder="Second username"
                style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #cbd5e1' }}
              />
              <button
                type="submit"
                style={{
                  border: 'none',
                  borderRadius: '14px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '14px 18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Compare Profiles
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Home;
