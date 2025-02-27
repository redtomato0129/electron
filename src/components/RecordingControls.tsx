import React from 'react';
import { Mic, Settings, PenLine, Camera } from 'lucide-react';

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
    <div className="bg-white rounded-lg border border-gray-200 w-[320px]">
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-sm font-medium mb-3">Recording</h2>
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
            <Mic className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Microphone</span>
            <span className="text-xs text-blue-600">On</span>
          </div>
        </div>

        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900"
        >
          {isRecording ? 'Stop recording' : 'Start recording'}
        </button>

        <div className="flex justify-between items-center pt-1">
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
    </div>
  );
};

export default RecordingControls;