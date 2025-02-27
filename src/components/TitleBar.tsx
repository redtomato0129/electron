import React from 'react';
import { Minus, X } from 'lucide-react';

// Add type definition for webkit app region
type WebkitAppRegion = {
  WebkitAppRegion: 'drag' | 'no-drag';
};

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electron?.windowControls.minimize();
  };

  const handleClose = () => {
    window.electron?.windowControls.close();
  };

  return (
    <div className="h-8 flex justify-between items-center px-2 app-drag">
      <div className="text-sm font-medium text-gray-600"></div>
      <div className="flex space-x-2">
        <button
          onClick={handleMinimize}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
        >
          <Minus className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={handleClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 