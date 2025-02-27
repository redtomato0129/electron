import React, { CSSProperties } from 'react';
import { Minus, Square, X, Home } from 'lucide-react';

// Extend CSSProperties to include webkit app region
interface ExtendedCSSProperties extends CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag';
}

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
    <div 
      className="h-8 flex items-center justify-between px-3 bg-transparent" 
      style={{
        paddingTop: '10px', 
        paddingRight: '15px',
        WebkitAppRegion: 'drag',
      } as ExtendedCSSProperties}
    >
      {/* Left side - home button */}
      <div className="flex items-center">
        {showHome && (
          <button
            onClick={onHomeClick}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
            style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
          >
            <Home className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right side - traffic lights */}
      <div 
        className="flex items-center gap-1.5"
        style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
      >
        <button 
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        />
        <button 
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
        />
        <button 
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
        />
      </div>
    </div>
  );
};

export default TitleBar; 