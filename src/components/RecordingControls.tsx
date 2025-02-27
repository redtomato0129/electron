import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  microphoneEnabled: boolean;
  speakerEnabled: boolean;
  onToggleMicrophone: () => void;
  onToggleSpeaker: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  microphoneEnabled,
  speakerEnabled,
  onToggleMicrophone,
  onToggleSpeaker,
  onStartRecording,
  onStopRecording
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <button
        onClick={onToggleMicrophone}
        className={`p-3 rounded-full ${
          microphoneEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
        }`}
        title={microphoneEnabled ? 'Disable microphone' : 'Enable microphone'}
      >
        {microphoneEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </button>
      
      <button
        onClick={onToggleSpeaker}
        className={`p-3 rounded-full ${
          speakerEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
        }`}
        title={speakerEnabled ? 'Disable system audio' : 'Enable system audio'}
      >
        {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
      
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`px-6 py-2 rounded-full font-medium ${
          isRecording 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default RecordingControls;