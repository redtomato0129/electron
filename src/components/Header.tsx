import React from 'react';
import { Mic, MicOff, Settings } from 'lucide-react';

interface HeaderProps {
  isRecording: boolean;
  duration: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isRecording,
  duration,
  onStartRecording,
  onStopRecording,
  onSettingsClick
}) => {
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
          >
            <Mic className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Voice Recording App</h1>
            {isRecording && <p className="text-sm text-gray-500">Recording: {duration}</p>}
          </div>
        </div>
        <button onClick={onSettingsClick}>
          <Settings className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Header;