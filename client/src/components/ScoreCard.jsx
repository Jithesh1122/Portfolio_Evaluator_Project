const wrapperStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
  display: 'grid',
  gap: '20px',
};

const headerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  alignItems: 'flex-start',
};

const ringWrapperStyle = {
  position: 'relative',
  width: '140px',
  height: '140px',
  display: 'grid',
  placeItems: 'center',
};

const ringLabelStyle = {
  position: 'absolute',
  textAlign: 'center',
  color: '#0f172a',
};

const contentStyle = {
  flex: '1 1 260px',
};

const scoreGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
};

const scoreItemStyle = {
  backgroundColor: '#eff6ff',
  borderRadius: '16px',
  padding: '16px',
};

const formatLabel = (label) =>
  label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (character) => character.toUpperCase())
    .trim();

function ScoreCard({ scores = {} }) {
  const overallScore = scores.overall?.score ?? 0;
  const overallLevel = scores.overall?.level || 'N/A';
  const circleRadius = 52;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const categories = [
    { key: 'activity', label: 'Activity' },
    { key: 'codeQuality', label: 'Code Quality' },
    { key: 'diversity', label: 'Diversity' },
    { key: 'community', label: 'Community' },
    { key: 'hiringReadiness', label: 'Hiring Readiness' },
  ];

  return (
    <section style={wrapperStyle}>
      <div style={headerStyle}>
        <div style={ringWrapperStyle}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={circleRadius}
              fill="none"
              stroke="#dbeafe"
              strokeWidth="12"
            />
            <circle
              cx="70"
              cy="70"
              r={circleRadius}
              fill="none"
              stroke="#2563eb"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div style={ringLabelStyle}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Overall</p>
            <h3 style={{ margin: '6px 0 2px', fontSize: '2rem' }}>{overallScore}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#2563eb' }}>{overallLevel}</p>
          </div>
        </div>
        <div style={contentStyle}>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
            Portfolio Score Summary
          </p>
          <h2 style={{ margin: '6px 0 8px', fontSize: '1.8rem' }}>Score Breakdown</h2>
          <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>
            A weighted portfolio score built from GitHub activity, code quality, diversity,
            community impact, and hiring readiness signals.
          </p>
        </div>
      </div>

      <div style={scoreGridStyle}>
        {categories.map(({ key, label }) => (
          <article key={key} style={scoreItemStyle}>
            <p style={{ margin: 0, color: '#475569' }}>{label}</p>
            <h3 style={{ margin: '8px 0 0', fontSize: '1.6rem', color: '#0f172a' }}>
              {scores[key]?.score ?? 0}
            </h3>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              {scores[key]?.level || `${formatLabel(key)} score`}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ScoreCard;
