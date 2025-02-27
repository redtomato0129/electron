import React from 'react';
import { Mic, Settings, PenLine, Camera, Pause } from 'lucide-react';

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
  duration = "00:00",
  onStartRecording,
  onStopRecording,
  onOpenNotes,
  onTakeScreenshot,
  onOpenSettings
}) => {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center justify-center mb-3 p-2">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-full shadow-sm">
          <button className="px-3 py-1 bg-white rounded-full text-sm shadow-sm hover:shadow transition-all">Meeting</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:bg-white hover:shadow rounded-full transition-all">Note</button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2 mb-4">
        <Mic className="h-4 w-4 text-blue-600" />
        <span className="text-sm flex-grow truncate">MacBook pro microph...</span>
        <span className="text-xs text-blue-600">On</span>
      </div>
      
      {/* Time Counter */}
      {isRecording && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-lg font-medium tracking-wider">{duration}</span>
            <button className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-all">
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col justify-center">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-full py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          {isRecording ? 'Stop recording' : 'Start recording'}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onOpenNotes}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:shadow-sm transition-all"
        >
          <PenLine className="h-4 w-4 mb-1" />
          <span className="text-xs">Notes</span>
        </button>

        <button
          onClick={onTakeScreenshot}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:shadow-sm transition-all"
        >
          <Camera className="h-4 w-4 mb-1" />
          <span className="text-xs">Screenshot</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:shadow-sm transition-all"
        >
          <Settings className="h-4 w-4 mb-1" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;