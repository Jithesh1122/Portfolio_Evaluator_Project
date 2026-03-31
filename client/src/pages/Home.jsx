import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    navigate(`/report/${trimmedUsername}`);
  };

  return (
    <main>
      <h1>Portfolio Evaluator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="github-username">GitHub Username</label>
        <input
          id="github-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter GitHub username"
        />
        <button type="submit">View Report</button>
      </form>
    </main>
  );
}

export default Home;
