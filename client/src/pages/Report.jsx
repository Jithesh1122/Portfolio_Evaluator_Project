import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api.js';

function Report() {
  const { username } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await api.get(`/profile/${username}`);
        setReport(data);
      } catch (requestError) {
        setError('Failed to load report.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [username]);

  if (isLoading) {
    return <main><p>Loading report...</p></main>;
  }

  if (error) {
    return <main><p>{error}</p></main>;
  }

  return (
    <main>
      <h1>{report?.name || report?.username}</h1>
      <p>{report?.bio || 'No bio available.'}</p>
    </main>
  );
}

export default Report;
