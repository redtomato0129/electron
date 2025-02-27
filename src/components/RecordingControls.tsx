import React from 'react';
import { Mic, Settings, PenLine, Camera, Home, X } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  duration?: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onOpenNotes: () => void;
  onTakeScreenshot: () => void;
  onOpenSettings: () => void;
  onHomeClick: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  duration,
  onStartRecording,
  onStopRecording,
  onOpenNotes,
  onTakeScreenshot,
  onOpenSettings,
  onHomeClick
}) => {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-gray-500">
          
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
          <button className="px-3 py-1 bg-white rounded-full text-sm shadow-sm">Meeting</button>
          <button className="px-3 py-1 text-sm text-gray-500">Note</button>
        </div>
        <button 
          onClick={onHomeClick}
          className="text-gray-500 hover:text-gray-700"
        >
          <Home className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2 mb-4">
        <Mic className="h-4 w-4 text-blue-600" />
        <span className="text-sm flex-grow truncate">MacBook pro microph...</span>
        <span className="text-xs text-blue-600">On</span>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-full py-2.5 rounded-lg text-sm font-medium ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          {isRecording ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Stop recording
            </div>
          ) : (
            'Start recording'
          )}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onOpenNotes}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700"
        >
          <PenLine className="h-4 w-4 mb-1" />
          <span className="text-xs">Notes</span>
        </button>

        <button
          onClick={onTakeScreenshot}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700"
        >
          <Camera className="h-4 w-4 mb-1" />
          <span className="text-xs">Screenshot</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700"
        >
          <Settings className="h-4 w-4 mb-1" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;