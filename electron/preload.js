const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // Window controls
    windowControls: {
      minimize: () => ipcRenderer.send('window-minimize'),
      maximize: () => ipcRenderer.send('window-maximize'),
      close: () => ipcRenderer.send('window-close'),
      resize: (width, height) => ipcRenderer.send('resize-window', { width, height }),
    },
    
    // Audio recording
    audioRecorder: {
      startRecording: (options) => ipcRenderer.send('start-recording', options),
      stopRecording: () => ipcRenderer.send('stop-recording'),
      onRecordingStarted: (callback) => {
        ipcRenderer.on('recording-started', () => callback());
        return () => ipcRenderer.removeListener('recording-started', callback);
      },
      onRecordingStopped: (callback) => {
        ipcRenderer.on('recording-stopped', (_, result) => callback(result));
        return () => ipcRenderer.removeListener('recording-stopped', callback);
      },
      onRecordingError: (callback) => {
        ipcRenderer.on('recording-error', (_, error) => callback(error));
        return () => ipcRenderer.removeListener('recording-error', callback);
      },
      getAudioDevices: () => ipcRenderer.invoke('get-audio-devices'),
    },
    
    // Transcription and notes
    transcription: {
      getTranscription: (recordingId) => ipcRenderer.invoke('get-transcription', recordingId),
      generateNotes: (recordingId) => ipcRenderer.invoke('generate-notes', recordingId),
      onTranscriptionUpdate: (callback) => {
        ipcRenderer.on('transcription-update', (_, data) => callback(data));
        return () => ipcRenderer.removeListener('transcription-update', callback);
      },
    },
    
    // Menu events
    menuEvents: {
      onStartRecording: (callback) => {
        ipcRenderer.on('menu-start-recording', () => callback());
        return () => ipcRenderer.removeListener('menu-start-recording', callback);
      },
      onStopRecording: (callback) => {
        ipcRenderer.on('menu-stop-recording', () => callback());
        return () => ipcRenderer.removeListener('menu-stop-recording', callback);
      },
    },
    
    // App info
    appInfo: {
      getVersion: () => ipcRenderer.invoke('get-app-version'),
    },
    
    systemPreferences: {
      askForMediaAccess: (mediaType) => ipcRenderer.invoke('ask-for-media-access', mediaType),
      getMediaAccessStatus: (mediaType) => ipcRenderer.invoke('get-media-access-status', mediaType),
    },
  }
);

// Memory optimization: Clean up listeners when window unloads
window.addEventListener('unload', () => {
  ipcRenderer.removeAllListeners('recording-started');
  ipcRenderer.removeAllListeners('recording-stopped');
  ipcRenderer.removeAllListeners('recording-error');
  ipcRenderer.removeAllListeners('transcription-update');
  ipcRenderer.removeAllListeners('menu-start-recording');
  ipcRenderer.removeAllListeners('menu-stop-recording');
});