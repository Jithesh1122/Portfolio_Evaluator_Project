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
      <div className="search-form__row">
        <input
          className="input search-form__input"
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
          className="button search-form__button"
        >
          {isLoading ? 'Loading...' : 'View Report'}
        </button>
      </div>
      <p className="search-form__hint">
        Try `octocat`, your own username, or any public GitHub profile.
      </p>
      {error ? <p className="feedback-error">{error}</p> : null}
    </form>
  );
}

export default SearchBar;
