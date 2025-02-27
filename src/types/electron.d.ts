export interface ElectronAPI {
  windowControls: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    resize: (width: number, height: number) => void;
  };
  audioRecorder: {
    startRecording: (options: any) => void;
    stopRecording: () => void;
    onRecordingStarted: (callback: () => void) => () => void;
    onRecordingStopped: (callback: (result: any) => void) => () => void;
    onRecordingError: (callback: (error: string) => void) => () => void;
    getAudioDevices: () => Promise<any>;
  };
  systemPreferences: {
    askForMediaAccess: (mediaType: string) => Promise<boolean>;
    getMediaAccessStatus: (mediaType: string) => Promise<string>;
  };
  // ... other API definitions as needed
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
} 