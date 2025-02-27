import React, { useState, useEffect } from 'react';
import PermissionsSetup from './components/PermissionsSetup';
import RecordingControls from './components/RecordingControls';
import NotesPanel from './components/NotesPanel';

function App() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState<string>('00:00');
  const [showNotes, setShowNotes] = useState(false);

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

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  if (!setupComplete) {
    return <PermissionsSetup onComplete={() => setSetupComplete(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-orange-100 p-6">
      <div className="max-w-screen-xl mx-auto flex gap-6">
        <div className="flex-1">
          <RecordingControls
            isRecording={isRecording}
            duration={duration}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onOpenNotes={() => setShowNotes(true)}
            onTakeScreenshot={() => {}}
            onOpenSettings={() => {}}
          />
        </div>
        {showNotes && (
          <div className="flex-1">
            <NotesPanel isRecording={isRecording} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;