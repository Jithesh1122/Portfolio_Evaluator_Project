const wrapperStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
};

const repoGridStyle = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
};

const repoCardStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '18px',
  padding: '18px',
  backgroundColor: '#f8fafc',
  display: 'grid',
  gap: '10px',
};

const statRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  color: '#334155',
  fontSize: '0.95rem',
};

function RepoList({ repos = [] }) {
  const topRepos = repos.slice(0, 6);

  return (
    <section style={wrapperStyle}>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
        Repository Highlights
      </p>
      <h2 style={{ margin: '6px 0 20px', fontSize: '1.8rem', color: '#0f172a' }}>
        Top Repositories
      </h2>

      {topRepos.length ? (
        <ul style={repoGridStyle}>
          {topRepos.map((repo) => (
            <li key={repo.name} style={repoCardStyle}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                  {repo.name}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
                {repo.description || 'No description available.'}
              </p>
              <div style={statRowStyle}>
                <span>Stars: {repo.stars ?? 0}</span>
                <span>Forks: {repo.forks ?? 0}</span>
                <span>Language: {repo.language || 'N/A'}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginBottom: 0 }}>No repositories available.</p>
      )}
    </section>
  );
}

export default RepoList;
