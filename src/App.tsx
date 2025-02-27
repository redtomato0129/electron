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
      if (!containerRef.current) return;
      
      // Get the content size
      const rect = containerRef.current.getBoundingClientRect();
      const width = 320; // Fixed width for the recording controls
      const height = Math.ceil(rect.height);

      // Type guard for the resize function
      const windowControls = window.electron?.windowControls;
      if (windowControls && 'resize' in windowControls) {
        (windowControls.resize as ResizeFunction)(width, height);
      }
    };

    // Initial resize
    updateWindowSize();

    // Add resize observer to handle dynamic content changes
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateWindowSize);
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [setupComplete, showNotes]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div ref={containerRef} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
      <TitleBar />
      <div className="pt-8">
        {!setupComplete ? (
          <PermissionsSetup onComplete={() => setSetupComplete(true)} />
        ) : (
          <div>
            <RecordingControls
              isRecording={isRecording}
              duration={duration}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onOpenNotes={() => setShowNotes(true)}
              onTakeScreenshot={() => {}}
              onOpenSettings={() => {}}
            />
            {showNotes && <NotesPanel isRecording={isRecording} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;