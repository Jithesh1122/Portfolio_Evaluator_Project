import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';
import Compare from './pages/Compare.jsx';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';

const THEME_STORAGE_KEY = 'portfolio-theme-v2';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'dark');

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <div className="theme-toggle-shell">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/report/:username" element={<Report />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
