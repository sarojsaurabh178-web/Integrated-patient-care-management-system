import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Current: ${isDark ? 'Dark Mode (🌙)' : 'Light Mode (☀️)'} - Click to switch`}
    >
      <div className={`theme-toggle-track ${isDark ? 'dark' : 'light'}`}>
        <span className="theme-toggle-icon light-icon" aria-hidden="true">
          <Sun size={14} />
        </span>
        <span className="theme-toggle-thumb">
          {isDark ? <Moon size={13} className="thumb-icon" /> : <Sun size={13} className="thumb-icon" />}
        </span>
        <span className="theme-toggle-icon dark-icon" aria-hidden="true">
          <Moon size={14} />
        </span>
      </div>
      <span className="theme-toggle-label d-none d-md-inline ms-2 fw-medium" style={{ fontSize: '0.825rem' }}>
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;
