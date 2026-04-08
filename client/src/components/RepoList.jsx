function RepoList({ repos = [] }) {
  const topRepos = repos.slice(0, 6);

  return (
    <section className="panel">
      <p className="panel__eyebrow">
        Repository Highlights
      </p>
      <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '20px' }}>
        Top Repositories
      </h2>

      {topRepos.length ? (
        <ul className="repo-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {topRepos.map((repo) => (
            <li
              key={repo.name}
              className="metric-card"
              style={{ display: 'grid', gap: '12px', alignContent: 'start' }}
            >
              <div>
                <h3 className="section-title" style={{ fontSize: '1.35rem', margin: 0 }}>{repo.name}</h3>
              </div>
              <p className="panel__text" style={{ margin: 0 }}>
                {repo.description || 'No description available.'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span className="profile-badge" style={{ width: 'fit-content' }}>Stars {repo.stars ?? 0}</span>
                <span className="profile-badge" style={{ width: 'fit-content', background: 'var(--mint-soft)', color: 'var(--mint)' }}>
                  Forks {repo.forks ?? 0}
                </span>
                <span className="profile-badge" style={{ width: 'fit-content', background: 'rgba(18,35,34,0.08)', color: 'var(--text)' }}>
                  {repo.language || 'N/A'}
                </span>
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
