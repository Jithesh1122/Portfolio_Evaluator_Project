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
  justifyContent: 'space-between',
  gap: '16px',
  alignItems: 'center',
};

const overallBadgeStyle = {
  minWidth: '120px',
  padding: '16px',
  borderRadius: '18px',
  background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
  color: '#ffffff',
  textAlign: 'center',
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
  const overallScore = scores.hiringReadiness?.score ?? 0;
  const overallLevel = scores.hiringReadiness?.level || 'N/A';

  const categories = [
    { key: 'activity', label: 'Activity' },
    { key: 'codeQuality', label: 'Code Quality' },
    { key: 'diversity', label: 'Diversity' },
    { key: 'community', label: 'Community' },
  ];

  return (
    <section style={wrapperStyle}>
      <div style={headerStyle}>
        <div>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
            Portfolio Score Summary
          </p>
          <h2 style={{ margin: '6px 0 0', fontSize: '1.8rem' }}>Score Breakdown</h2>
        </div>
        <div style={overallBadgeStyle}>
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85 }}>Overall Score</p>
          <h3 style={{ margin: '8px 0 4px', fontSize: '2rem' }}>{overallScore}</h3>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{overallLevel}</p>
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
