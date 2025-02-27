import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, systemPreferences } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { createAudioRecorder } from './audioRecorder.js';
import { setupSecureStorage } from './secureStorage.js';
import { setupApiClient } from './apiClient.js';
import { bringToFront } from './platform.js';

// Convert ESM meta URLs to file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global references to prevent garbage collection
let mainWindow = null;
let tray;
let audioRecorder;
let apiClient;

// Memory optimization: Set max listeners to reduce memory leaks
process.setMaxListeners(5);

async function createWindow() {
  // Request microphone permissions on macOS
  if (process.platform === 'darwin') {
    const micPermission = systemPreferences.getMediaAccessStatus('microphone');
    if (micPermission !== 'granted') {
      await systemPreferences.askForMediaAccess('microphone');
    }
  }

  // Create the browser window with updated settings
  mainWindow = new BrowserWindow({
    width: 320, // Starting width
    height: 400, // Starting height
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,
    transparent: false,
    backgroundColor: '#ffffff',
    resizable: false, // Prevent user resizing
    show: false,
  });

  // Center the window
  mainWindow.center();

  // Add listener for content size changes
  ipcMain.on('resize-window', (event, { width, height }) => {
    if (mainWindow) {
      mainWindow.setSize(width, height);
      mainWindow.center();
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create tray icon
  setupTray();

  // Initialize modules
  setupSecureStorage();
  apiClient = setupApiClient();
  audioRecorder = createAudioRecorder(apiClient);

  // Set up IPC handlers
  setupIpcHandlers();

  // Memory optimization: Clean up on window close
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (audioRecorder && audioRecorder.isRecording()) {
      audioRecorder.stopRecording();
    }
  });

  // Add error event listener
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Add window focus handling
  mainWindow.on('focus', () => {
    bringToFront(mainWindow).catch(console.error);
  });
}

function setupTray() {
  // Create tray icon
  const iconPath = path.join(__dirname, '../assets/tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Voice Recording App', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Start Recording', click: () => mainWindow.webContents.send('menu-start-recording') },
    { label: 'Stop Recording', click: () => mainWindow.webContents.send('menu-stop-recording') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setToolTip('Voice Recording App');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
}

function setupIpcHandlers() {
  // Window controls
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow.close());

  // Audio recording
  ipcMain.on('start-recording', async (event, options) => {
    try {
      await audioRecorder.startRecording(options);
      event.reply('recording-started');
    } catch (error) {
      event.reply('recording-error', error.message);
    }
  });

  ipcMain.on('stop-recording', async (event) => {
    try {
      const result = await audioRecorder.stopRecording();
      event.reply('recording-stopped', result);
    } catch (error) {
      event.reply('recording-error', error.message);
    }
  });

  // Transcription and notes
  ipcMain.handle('get-transcription', async (event, recordingId) => {
    try {
      return await apiClient.getTranscription(recordingId);
    } catch (error) {
      throw new Error(`Failed to get transcription: ${error.message}`);
    }
  });

  ipcMain.handle('generate-notes', async (event, recordingId) => {
    try {
      return await apiClient.generateNotes(recordingId);
    } catch (error) {
      throw new Error(`Failed to generate notes: ${error.message}`);
    }
  });

  // Audio devices
  ipcMain.handle('get-audio-devices', async () => {
    return await audioRecorder.getAudioDevices();
  });

  // System Preferences handlers
  ipcMain.handle('ask-for-media-access', async (event, mediaType) => {
    try {
      switch (mediaType) {
        case 'microphone':
          return await systemPreferences.askForMediaAccess('microphone');
        
        case 'screen':
          // On macOS, screen recording permission is handled differently
          if (process.platform === 'darwin') {
            return systemPreferences.getMediaAccessStatus('screen') === 'granted';
          }
          return true;
        
        case 'accessibility':
          // On macOS, check accessibility permissions
          if (process.platform === 'darwin') {
            return systemPreferences.isTrusted('accessibility');
          }
          return true;
        
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error requesting ${mediaType} access:`, error);
      return false;
    }
  });

  ipcMain.handle('get-media-access-status', async (event, mediaType) => {
    try {
      switch (mediaType) {
        case 'microphone':
          return systemPreferences.getMediaAccessStatus('microphone');
        
        case 'screen':
          if (process.platform === 'darwin') {
            return systemPreferences.getMediaAccessStatus('screen');
          }
          return 'granted';
        
        case 'accessibility':
          if (process.platform === 'darwin') {
            return systemPreferences.isTrusted('accessibility') ? 'granted' : 'denied';
          }
          return 'granted';
        
        default:
          return 'denied';
      }
    } catch (error) {
      console.error(`Error getting ${mediaType} access status:`, error);
      return 'denied';
    }
  });

  // Add window resize handler
  ipcMain.on('resize-window', (event, { width, height }) => {
    if (mainWindow) {
      mainWindow.setSize(width, height);
      mainWindow.center();
    }
  });
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create a new window if none exists (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle errors
app.on('render-process-gone', (event, webContents, details) => {
  console.error('Render process gone:', details);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Attempt to gracefully shut down
  if (audioRecorder && audioRecorder.isRecording()) {
    audioRecorder.stopRecording().catch(() => {});
  }
});