import { desktopCapturer } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Create a temporary directory for storing audio chunks
const TEMP_DIR = path.join(os.tmpdir(), 'voice-recording-app');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export function createAudioRecorder(apiClient) {
  let mediaRecorder = null;
  let recordingStream = null;
  let audioChunks = [];
  let recordingId = null;
  let isRecording = false;
  let transcriptionInterval = null;
  
  // Clean up any temporary files on startup
  cleanupTempFiles();
  
  async function getAudioDevices() {
    try {
      // Get all audio input devices using Electron's desktopCapturer
      const sources = await desktopCapturer.getSources({ 
        types: ['audio'],
        thumbnailSize: { width: 0, height: 0 }
      });
      
      // Filter for audio sources
      const audioSources = sources.filter(source => 
        source.id.includes('audio') || 
        source.name.toLowerCase().includes('audio') ||
        source.name.toLowerCase().includes('microphone') ||
        source.name.toLowerCase().includes('speaker')
      );
      
      // Check for system audio loopback devices
      const hasLoopbackDevice = audioSources.some(source => 
        source.name.toLowerCase().includes('blackhole') || 
        source.name.toLowerCase().includes('loopback')
      );
      
      return {
        devices: audioSources.map(source => ({
          id: source.id,
          name: source.name,
          type: source.name.toLowerCase().includes('microphone') ? 'microphone' : 'system'
        })),
        hasLoopbackDevice
      };
    } catch (error) {
      console.error('Error getting audio devices:', error);
      throw new Error(`Failed to get audio devices: ${error.message}`);
    }
  }
  
  async function startRecording(options = {}) {
    if (isRecording) {
      throw new Error('Already recording');
    }
    
    try {
      // Generate a unique ID for this recording
      recordingId = uuidv4();
      audioChunks = [];
      
      // Get the audio stream using Electron's desktopCapturer
      const sources = await desktopCapturer.getSources({ 
        types: ['audio'],
        thumbnailSize: { width: 0, height: 0 }
      });
      
      let selectedSource;
      if (options.microphoneId) {
        selectedSource = sources.find(s => s.id === options.microphoneId);
      }
      if (!selectedSource && options.speakerId) {
        selectedSource = sources.find(s => s.id === options.speakerId);
      }
      if (!selectedSource) {
        selectedSource = sources[0]; // fallback to first available source
      }
      
      if (!selectedSource) {
        throw new Error('No audio source available');
      }
      
      // Create MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: selectedSource.id
          }
        },
        video: false
      });
      
      recordingStream = stream;
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(1000); // Capture in 1-second chunks
      isRecording = true;
      
      setupTranscriptionUpdates();
      
      return recordingId;
    } catch (error) {
      console.error('Error starting recording:', error);
      cleanupRecording();
      throw error;
    }
  }
  
  async function stopRecording() {
    if (!isRecording || !mediaRecorder) {
      throw new Error('Not recording');
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Stop the transcription interval
        if (transcriptionInterval) {
          clearInterval(transcriptionInterval);
          transcriptionInterval = null;
        }
        
        // Handle the recording stop event
        mediaRecorder.onstop = async () => {
          try {
            // Process the final audio file
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
            const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());
            
            // Save to temp file
            const tempFilePath = path.join(TEMP_DIR, `${recordingId}.webm`);
            fs.writeFileSync(tempFilePath, audioBuffer);
            
            // Upload to backend
            const result = await apiClient.uploadRecording(recordingId, tempFilePath);
            
            // Clean up
            cleanupRecording();
            
            // Return the result
            resolve({
              recordingId,
              duration: result.duration,
              fileSize: result.fileSize
            });
          } catch (error) {
            reject(new Error(`Error processing recording: ${error.message}`));
          }
        };
        
        // Stop the media recorder
        mediaRecorder.stop();
        
        // Stop all tracks in the stream
        if (recordingStream) {
          recordingStream.getTracks().forEach(track => track.stop());
        }
        
        isRecording = false;
      } catch (error) {
        cleanupRecording();
        reject(new Error(`Failed to stop recording: ${error.message}`));
      }
    });
  }
  
  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      audioChunks.push(event.data);
      
      // Process chunk for real-time transcription
      processAudioChunk(event.data).catch(console.error);
    }
  }
  
  async function processAudioChunk(chunk) {
    try {
      // Convert chunk to buffer
      const arrayBuffer = await chunk.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save chunk to temp file
      const chunkPath = path.join(TEMP_DIR, `${recordingId}_chunk_${audioChunks.length}.webm`);
      fs.writeFileSync(chunkPath, buffer);
      
      // Upload chunk for transcription
      await apiClient.uploadChunk(recordingId, chunkPath, audioChunks.length);
      
      // Clean up chunk file
      fs.unlinkSync(chunkPath);
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  }
  
  function setupTranscriptionUpdates() {
    // Poll for transcription updates every 3 seconds
    transcriptionInterval = setInterval(async () => {
      if (!isRecording || !recordingId) return;
      
      try {
        const transcription = await apiClient.getTranscription(recordingId);
        // The API client will emit events to the renderer
      } catch (error) {
        console.error('Error getting transcription update:', error);
      }
    }, 3000);
  }
  
  function cleanupRecording() {
    // Clear recording state
    if (transcriptionInterval) {
      clearInterval(transcriptionInterval);
      transcriptionInterval = null;
    }
    
    if (recordingStream) {
      recordingStream.getTracks().forEach(track => track.stop());
      recordingStream = null;
    }
    
    mediaRecorder = null;
    audioChunks = [];
    isRecording = false;
  }
  
  function cleanupTempFiles() {
    try {
      // Delete all temporary files older than 1 hour
      const files = fs.readdirSync(TEMP_DIR);
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      for (const file of files) {
        const filePath = path.join(TEMP_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtimeMs < oneHourAgo) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }
  
  return {
    getAudioDevices,
    startRecording,
    stopRecording,
    isRecording: () => isRecording
  };
}