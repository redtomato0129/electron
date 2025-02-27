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
    
    // System Preferences
    systemPreferences: {
      askForMediaAccess: (mediaType) => ipcRenderer.invoke('ask-for-media-access', mediaType),
      getMediaAccessStatus: (mediaType) => ipcRenderer.invoke('get-media-access-status', mediaType),
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
    
    // Add notes API
    notes: {
      openNotepad: (placeholder) => ipcRenderer.send('open-notepad', placeholder),
    },
  }
); 