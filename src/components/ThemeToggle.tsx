'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  /** Optional external class name for styling */
  className?: string;
  /** Custom size for icons */
  iconSize?: number;
  /** Optional label for accessibility (defaults automatically) */
  ariaLabel?: string;
  /** Custom onChange handler */
  onChange?: (newTheme: 'light' | 'dark') => void;
  /** Children for flexible content rendering (e.g., tooltip or label) */
  children?: React.ReactNode;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  iconSize = 20,
  ariaLabel,
  onChange,
  children,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // ✅ Load user preference or system default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  // ✅ Theme toggle logic with external event callback
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    onChange?.(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${className}`}
      aria-label={ariaLabel || `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      role="switch"
    >
      {theme === 'light' ? (
        <Moon size={iconSize} className="text-gray-800" />
      ) : (
        <Sun size={iconSize} className="text-yellow-400" />
      )}
      {children && (
        <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">
          {children}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
