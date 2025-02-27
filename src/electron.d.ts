interface ElectronAPI {
  windowControls: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    resize: (width: number, height: number) => void;
  };
  systemPreferences: {
    askForMediaAccess: (mediaType: string) => Promise<boolean>;
    getMediaAccessStatus: (mediaType: string) => Promise<string>;
  };
  audioRecorder: {
    startRecording: (options: any) => void;
    stopRecording: () => void;
    onRecordingStarted: (callback: () => void) => () => void;
    onRecordingStopped: (callback: (result: any) => void) => () => void;
    onRecordingError: (callback: (error: string) => void) => () => void;
    getAudioDevices: () => Promise<any>;
  };
  transcription: {
    getTranscription: (recordingId: string) => Promise<any>;
    generateNotes: (recordingId: string) => Promise<any>;
    onTranscriptionUpdate: (callback: (data: any) => void) => () => void;
  };
  menuEvents: {
    onStartRecording: (callback: () => void) => () => void;
    onStopRecording: (callback: () => void) => () => void;
  };
  appInfo: {
    getVersion: () => Promise<string>;
  };
  notes: {
    openNotepad: (placeholder: string) => void;
  };
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {}; 