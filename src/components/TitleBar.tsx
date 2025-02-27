import React from 'react';
import { Minus, Square, X, Home } from 'lucide-react';

// Add type definition for webkit app region
type WebkitAppRegion = {
  WebkitAppRegion: 'drag' | 'no-drag';
};

interface TitleBarProps {
  showHome?: boolean;
  onHomeClick?: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ showHome = false, onHomeClick }) => {
  const handleMinimize = () => {
    window.electron?.windowControls?.minimize();
  };

  const handleMaximize = () => {
    window.electron?.windowControls?.maximize();
  };

  const handleClose = () => {
    window.electron?.windowControls?.close();
  };

  return (
    <div className="h-8 flex items-center justify-between px-3 bg-transparent">
      {/* Left side */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      {/* Center - show home button if needed */}
      {showHome && (
        <button
          onClick={onHomeClick}
          className="absolute left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
        >
          <Home className="h-4 w-4" />
        </button>
      )}

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMinimize}
          className="text-gray-500 hover:text-gray-700"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="text-gray-500 hover:text-gray-700"
        >
          <Square className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 