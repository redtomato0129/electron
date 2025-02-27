import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RecordingControls from './components/RecordingControls';
import TranscriptionPanel from './components/TranscriptionPanel';
import NotesPanel from './components/NotesPanel';
import SettingsPanel from './components/SettingsPanel';

interface AudioDevice {
  id: string;
  name: string;
  type: 'microphone' | 'system';
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState('00:00');
  const [showSettings, setShowSettings] = useState(false);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [hasLoopbackDevice, setHasLoopbackDevice] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [notes, setNotes] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);

  useEffect(() => {
    // Load audio devices on mount
    loadAudioDevices();

    // Set up recording event listeners
    window.electron.audioRecorder.onRecordingStarted(() => {
      setIsRecording(true);
      startDurationTimer();
    });

    window.electron.audioRecorder.onRecordingStopped((result) => {
      setIsRecording(false);
      setRecordingId(result.recordingId);
      stopDurationTimer();
    });

    window.electron.audioRecorder.onRecordingError((error) => {
      console.error('Recording error:', error);
      setIsRecording(false);
      // TODO: Show error toast
    });

    window.electron.transcription.onTranscriptionUpdate((data) => {
      setTranscription(data.text);
    });

    // Clean up
    return () => {
      stopDurationTimer();
    };
  }, []);

  const loadAudioDevices = async () => {
    try {
      const { devices, hasLoopbackDevice: hasLoopback } = await window.electron.audioRecorder.getAudioDevices();
      setAudioDevices(devices);
      setHasLoopbackDevice(hasLoopback);

      // Select first available devices by default
      const defaultMic = devices.find(d => d.type === 'microphone');
      const defaultSpeaker = devices.find(d => d.type === 'system');
      
      if (defaultMic) setSelectedMicrophone(defaultMic.id);
      if (defaultSpeaker) setSelectedSpeaker(defaultSpeaker.id);
    } catch (error) {
      console.error('Error loading audio devices:', error);
    }
  };

  const startDurationTimer = () => {
    let seconds = 0;
    const timer = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setDuration(
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    // Store timer ID for cleanup
    (window as any).durationTimer = timer;
  };

  const stopDurationTimer = () => {
    if ((window as any).durationTimer) {
      clearInterval((window as any).durationTimer);
      (window as any).durationTimer = null;
    }
  };

  const handleStartRecording = () => {
    window.electron.audioRecorder.startRecording({
      microphoneId: selectedMicrophone,
      speakerId: selectedSpeaker
    });
  };

  const handleStopRecording = () => {
    window.electron.audioRecorder.stopRecording();
  };

  const handleGenerateNotes = async () => {
    if (!recordingId) return;

    setIsGeneratingNotes(true);
    try {
      const result = await window.electron.transcription.generateNotes(recordingId);
      setNotes(result.notes);
    } catch (error) {
      console.error('Error generating notes:', error);
      // TODO: Show error toast
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header 
        isRecording={isRecording}
        duration={duration}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <div className="flex-1 p-6 space-y-6">
        <RecordingControls 
          isRecording={isRecording}
          microphoneEnabled={!!selectedMicrophone}
          speakerEnabled={!!selectedSpeaker}
          onToggleMicrophone={() => setSelectedMicrophone(null)}
          onToggleSpeaker={() => setSelectedSpeaker(null)}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
        
        <div className="grid grid-cols-2 gap-6 flex-1">
          <TranscriptionPanel 
            transcription={transcription}
            isRecording={isRecording}
            onGenerateNotes={handleGenerateNotes}
            isGeneratingNotes={isGeneratingNotes}
          />
          
          <NotesPanel 
            notes={notes}
            isLoading={isGeneratingNotes}
          />
        </div>
      </div>

      {showSettings && (
        <SettingsPanel 
          onClose={() => setShowSettings(false)}
          audioDevices={audioDevices}
          selectedMicrophone={selectedMicrophone}
          selectedSpeaker={selectedSpeaker}
          hasLoopbackDevice={hasLoopbackDevice}
          onSelectMicrophone={setSelectedMicrophone}
          onSelectSpeaker={setSelectedSpeaker}
          onRefreshDevices={loadAudioDevices}
        />
      )}
    </div>
  );
}

export default App;