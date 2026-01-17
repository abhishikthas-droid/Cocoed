import React, { useState } from 'react';
import { AppView } from '../types';
import ThemeToggle from './ThemeToggle';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onChangeView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Notes', value: AppView.GENERATOR },
    { label: 'Saved', value: AppView.SAVED },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-3 md:px-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center glass rounded-2xl px-4 py-2 mt-4">
        <button
          onClick={() => window.location.href = 'https://cocoed-launching-page.vercel.app/'}
          className="flex items-center gap-1 text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity logo-glow"
        >
          <span className="text-slate-900 dark:text-white">cocoed</span>
          <span className="text-primary dark:text-blue-400">AI</span>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 mr-4">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onChangeView(item.value)}
                className={`text-sm font-semibold transition-all ${currentView === item.value
                  ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-20 right-4 w-48 glass rounded-xl shadow-xl py-2 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onChangeView(item.value);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${currentView === item.value
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;