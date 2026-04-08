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
    <form onSubmit={handleSubmit} className="search-form">
      <label htmlFor="github-username" className="label">GitHub Username</label>
      <input
        className="input"
        id="github-username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter GitHub username"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="button"
        style={{ width: 'fit-content' }}
      >
        {isLoading ? 'Loading...' : 'View Report'}
      </button>
      {error ? <p className="feedback-error">{error}</p> : null}
    </form>
  );
}

export default SearchBar;
