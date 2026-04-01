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
    <form onSubmit={handleSubmit}>
      <label htmlFor="github-username">GitHub Username</label>
      <input
        id="github-username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter GitHub username"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'View Report'}
      </button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}

export default SearchBar;
