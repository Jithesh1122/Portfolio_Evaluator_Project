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
    <section className="panel">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'grid', placeItems: 'center' }}>
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
          <div style={{ position: 'absolute', textAlign: 'center', color: 'var(--text)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Overall</p>
            <h3 style={{ margin: '6px 0 2px', fontSize: '2rem' }}>{overallScore}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-deep)' }}>{overallLevel}</p>
          </div>
        </div>
        <div style={{ flex: '1 1 260px' }}>
          <p className="panel__eyebrow" style={{ marginBottom: '8px' }}>
            Portfolio Score Summary
          </p>
          <h2 className="section-title" style={{ fontSize: '2.4rem', marginTop: 0 }}>
            Score Breakdown
          </h2>
          <p className="panel__text" style={{ margin: 0 }}>
            A weighted portfolio score built from GitHub activity, code quality, diversity,
            community impact, and hiring readiness signals.
          </p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '20px' }}>
        {categories.map(({ key, label }) => (
          <article key={key} className="metric-card">
            <p className="metric-card__label">{label}</p>
            <h3 className="metric-card__value" style={{ fontSize: '1.8rem' }}>
              {scores[key]?.score ?? 0}
            </h3>
            <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.88rem' }}>
              {scores[key]?.level || `${formatLabel(key)} score`}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ScoreCard;
