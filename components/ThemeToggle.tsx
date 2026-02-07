'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className="absolute inset-0 w-5 h-5 text-amber-500 transform transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" 
          strokeWidth={2.5}
        />
        <Moon 
          className="absolute inset-0 w-5 h-5 text-blue-500 transform transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" 
          strokeWidth={2.5}
        />
      </div>
    </button>
  );
}
