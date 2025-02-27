import { BrowserWindow } from 'electron';

export const bringToFront = async (window) => {
  if (!window.isVisible()) {
    window.show();
  }
  
  if (window.isMinimized()) {
    window.restore();
  }
  
  window.focus();
  
  if (process.platform === 'win32') {
    // Windows-specific: Set window as foreground window
    window.setAlwaysOnTop(true);
    window.setAlwaysOnTop(false);
  }
}; 