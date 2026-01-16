import React, { useState } from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onChangeView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Notes', value: AppView.GENERATOR },
    { label: 'Saved', value: AppView.SAVED },
    // { label: 'AI Help', value: AppView.AI_HELP }, // Placeholder for future feature
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-10 px-4 py-4 md:px-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center text-white">
        {/* Logo */}
        <button 
          onClick={() => onChangeView(AppView.GENERATOR)}
          className="text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          cocoed AI
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onChangeView(item.value)}
              className={`text-sm font-medium transition-colors ${
                currentView === item.value 
                  ? 'text-white border-b-2 border-white pb-0.5' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
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

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white rounded-lg shadow-xl py-2 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onChangeView(item.value);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentView === item.value 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
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