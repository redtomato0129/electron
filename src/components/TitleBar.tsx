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
    <div className="h-8 flex justify-end items-center px-3 select-none webkit-drag">
      <div className="flex gap-2 webkit-no-drag">
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
        >
          <Minus className="w-2 h-2 text-gray-600" />
        </button>
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-gray-300 hover:bg-red-500 flex items-center justify-center"
        >
          <X className="w-2 h-2 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 