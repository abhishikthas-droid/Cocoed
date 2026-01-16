import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full glass hover:scale-110 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6">
        <div className={`absolute inset-0 transform transition-all duration-500 ease-out ${
          theme === 'light' ? 'translate-y-0 rotate-0 opacity-100' : 'translate-y-8 rotate-90 opacity-0'
        }`}>
          <Sun className="w-6 h-6 text-amber-500 fill-amber-500" />
        </div>
        <div className={`absolute inset-0 transform transition-all duration-500 ease-out ${
          theme === 'dark' ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-8 -rotate-90 opacity-0'
        }`}>
          <Moon className="w-6 h-6 text-blue-400 fill-blue-400" />
        </div>
      </div>
      
      {/* Background glow effect on toggle */}
      <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-xl"></div>
    </button>
  );
};

export default ThemeToggle;
