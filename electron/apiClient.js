import axios from 'axios';
import fs from 'fs';
import { ipcMain } from 'electron';
import { getSecureStorage } from './secureStorage.js';

export function setupApiClient() {
  // Get API configuration from secure storage
  const secureStorage = getSecureStorage();
  const API_BASE_URL = secureStorage.get('apiBaseUrl') || 'https://api.example.com';
  const API_KEY = secureStorage.get('apiKey') || '';
  
  // Create axios instance with default config
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 second timeout
  });
  
  // Set up retry mechanism
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;
  
  async function retryRequest(fn, retries = MAX_RETRIES, delay = RETRY_DELAY) {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0 || error.response?.status === 401) {
        throw error;
      }
      
      console.log(`Request failed, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
  }
  
  // API methods
  async function uploadRecording(recordingId, filePath) {
    try {
      const fileStream = fs.createReadStream(filePath);
      const fileSize = fs.statSync(filePath).size;
      
      const formData = new FormData();
      formData.append('file', fileStream);
      formData.append('recordingId', recordingId);
      
      const response = await retryRequest(() => api.post('/recordings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      }));
      
      return {
        recordingId,
        duration: response.data.duration,
        fileSize
      };
    } catch (error) {
      console.error('Error uploading recording:', error);
      throw new Error(`Failed to upload recording: ${error.message}`);
    }
  }
  
  async function uploadChunk(recordingId, chunkPath, chunkIndex) {
    try {
      const fileStream = fs.createReadStream(chunkPath);
      
      const formData = new FormData();
      formData.append('file', fileStream);
      formData.append('recordingId', recordingId);
      formData.append('chunkIndex', chunkIndex.toString());
      
      await retryRequest(() => api.post('/recordings/chunk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error uploading chunk:', error);
      throw new Error(`Failed to upload chunk: ${error.message}`);
    }
  }
  
  async function getTranscription(recordingId) {
    try {
      const response = await retryRequest(() => 
        api.get(`/transcriptions/${recordingId}`)
      );
      
      // Emit the transcription update to the renderer
      const mainWindow = BrowserWindow.getAllWindows()[0];
      if (mainWindow) {
        mainWindow.webContents.send('transcription-update', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting transcription:', error);
      throw new Error(`Failed to get transcription: ${error.message}`);
    }
  }
  
  async function generateNotes(recordingId) {
    try {
      const response = await retryRequest(() => 
        api.post(`/notes/generate`, { recordingId })
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating notes:', error);
      throw new Error(`Failed to generate notes: ${error.message}`);
    }
  }
  
  // IPC handlers for API configuration
  ipcMain.handle('set-api-config', async (event, config) => {
    try {
      if (config.apiBaseUrl) {
        secureStorage.set('apiBaseUrl', config.apiBaseUrl);
        api.defaults.baseURL = config.apiBaseUrl;
      }
      
      if (config.apiKey) {
        secureStorage.set('apiKey', config.apiKey);
        api.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error setting API config:', error);
      throw new Error(`Failed to set API config: ${error.message}`);
    }
  });
  
  ipcMain.handle('get-api-config', async () => {
    return {
      apiBaseUrl: secureStorage.get('apiBaseUrl') || '',
      // Don't return the actual API key for security
      hasApiKey: !!secureStorage.get('apiKey')
    };
  });
  
  return {
    uploadRecording,
    uploadChunk,
    getTranscription,
    generateNotes
  };
}