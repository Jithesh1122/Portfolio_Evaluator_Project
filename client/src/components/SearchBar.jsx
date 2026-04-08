import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError('Please enter a GitHub username.');
      return;
    }

    setError('');
    setIsLoading(true);
    navigate(`/report/${trimmedUsername}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
      <label htmlFor="github-username" style={{ fontWeight: 600 }}>GitHub Username</label>
      <input
        id="github-username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter GitHub username"
        disabled={isLoading}
        style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #cbd5e1' }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: 'fit-content',
          border: 'none',
          borderRadius: '14px',
          padding: '12px 18px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {isLoading ? 'Loading...' : 'View Report'}
      </button>
      {error ? <p style={{ margin: 0, color: '#dc2626' }}>{error}</p> : null}
    </form>
  );
}

export default SearchBar;
