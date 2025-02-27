import React from 'react';
import { Mic, Settings, Home, PenLine, Camera } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  duration?: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onOpenNotes: () => void;
  onTakeScreenshot: () => void;
  onOpenSettings: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  duration,
  onStartRecording,
  onStopRecording,
  onOpenNotes,
  onTakeScreenshot,
  onOpenSettings
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-gray-700">
            <Home className="h-5 w-5" />
          </button>
          <span className="font-medium">Meeting</span>
          <span className="text-gray-400">Note</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <div className="flex items-center gap-3 mb-4 bg-blue-50 rounded-lg p-3">
        <Mic className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <span className="text-sm">MacBook pro microph...</span>
          <span className="ml-2 text-xs text-blue-600">On</span>
        </div>
      </div>

      {isRecording && duration && (
        <div className="text-center mb-4">
          <span className="text-xl font-mono">{duration}</span>
        </div>
      )}

      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`w-full py-3 rounded-full font-medium mb-4 ${
          isRecording 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-black text-white hover:bg-gray-900'
        }`}
      >
        {isRecording ? 'Stop recording' : 'Start recording'}
      </button>

      <div className="flex justify-between items-center">
        <button
          onClick={onOpenNotes}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700"
        >
          <PenLine className="h-5 w-5 mb-1" />
          <span className="text-xs">Notes</span>
        </button>

        <button
          onClick={onTakeScreenshot}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700"
        >
          <Camera className="h-5 w-5 mb-1" />
          <span className="text-xs">Screenshot</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700"
        >
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;