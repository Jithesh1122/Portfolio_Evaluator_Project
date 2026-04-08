function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : ''}`}
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb">
          <span className="theme-toggle__icon" aria-hidden="true">
            {isDark ? (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path
                  d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                <path
                  d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;
