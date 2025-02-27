/// <reference types="vite/client" />
/// <reference types="electron" />

interface Window {
  electron: {
    windowControls: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
    
    audioRecorder: {
      startRecording: (options: any) => void;
      stopRecording: () => void;
      onRecordingStarted: (callback: () => void) => void;
      onRecordingStopped: (callback: (result: any) => void) => void;
      onRecordingError: (callback: (error: string) => void) => void;
      getAudioDevices: () => Promise<{
        devices: Array<{
          id: string;
          name: string;
          type: 'microphone' | 'system';
        }>;
        hasLoopbackDevice: boolean;
      }>;
    };
    
    transcription: {
      getTranscription: (recordingId: string) => Promise<any>;
      generateNotes: (recordingId: string) => Promise<any>;
      onTranscriptionUpdate: (callback: (data: any) => void) => void;
    };
    
    menuEvents: {
      onStartRecording: (callback: () => void) => void;
      onStopRecording: (callback: () => void) => void;
    };
    
    appInfo: {
      getVersion: () => Promise<string>;
    };
  };
}