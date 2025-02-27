import React, { useState, useEffect, useRef } from 'react';
import TitleBar from './components/TitleBar';
import PermissionsSetup from './components/PermissionsSetup';
import RecordingControls from './components/RecordingControls';
import NotesPanel from './components/NotesPanel';

// Add type for the resize function
type ResizeFunction = (width: number, height: number) => void;

function App() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState<string>('00:00');
  const [showNotes, setShowNotes] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      const startTime = Date.now();
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle window resizing when content changes
  useEffect(() => {
    const updateWindowSize = () => {
      const windowControls = window.electron?.windowControls;
      if (windowControls && 'resize' in windowControls) {
        const width = setupComplete ? 280 : 320;  // 280 for recording, 320 for permissions
        const height = setupComplete ? (isRecording ? 340 : 280) : 450; // 300 when recording, 280 when not, 450 for permissions
        
        setTimeout(() => {
          (windowControls.resize as ResizeFunction)(width, height);
        }, 0);
      }
    };

    updateWindowSize();
  }, [setupComplete, isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleHomeClick = () => {
    setSetupComplete(false);
    setIsRecording(false);
    setDuration('00:00');
    setShowNotes(false);
  };

  return (
    <div 
      ref={containerRef} 
      className={`bg-white/95 backdrop-blur-sm overflow-hidden flex flex-col ${
        setupComplete ? (isRecording ? 'h-[340px]' : 'h-[280px]') : 'h-[450px]'
      }`}
      style={{ 
        width: setupComplete ? '280px' : '340px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <TitleBar 
        showHome={setupComplete} 
        onHomeClick={handleHomeClick} 
      />
      <div className="flex-1">
        {!setupComplete ? (
          <PermissionsSetup onComplete={() => setSetupComplete(true)} />
        ) : (
          <RecordingControls
            isRecording={isRecording}
            duration={duration}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onOpenNotes={() => setShowNotes(true)}
            onTakeScreenshot={() => {}}
            onOpenSettings={() => {}}
          />
        )}
      </div>
    </div>
  );
}

export default App;